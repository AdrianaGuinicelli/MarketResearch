import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

function parseForm(req) {
  const form = formidable({
    multiples: true,
    keepExtensions: true
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

async function uploadSingleFile(file, vectorStoreId) {
  const fileUploadForm = new FormData();

  fileUploadForm.append("purpose", "assistants");
  fileUploadForm.append(
    "file",
    new Blob([fs.readFileSync(file.filepath)]),
    file.originalFilename || "uploaded_file"
  );

  const uploadResponse = await fetch("https://api.openai.com/v1/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: fileUploadForm
  });

  const uploadData = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(uploadData.error?.message || "OpenAI file upload error");
  }

  const attachResponse = await fetch(
    `https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        file_id: uploadData.id
      })
    }
  );

  const attachData = await attachResponse.json();

  if (!attachResponse.ok) {
    throw new Error(attachData.error?.message || "Vector store attach error");
  }

  return {
    id: uploadData.id,
    name: file.originalFilename,
    type: file.mimetype,
    vectorStoreFileId: attachData.id
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { files } = await parseForm(req);

    const uploadedFilesRaw = files.file
      ? Array.isArray(files.file)
        ? files.file
        : [files.file]
      : [];

    if (uploadedFilesRaw.length === 0) {
      return res.status(400).json({ error: "Missing file" });
    }

    const vectorStoreId = process.env.COMPANY_VECTOR_STORE_ID;

    if (!vectorStoreId) {
      return res.status(500).json({
        error: "Missing COMPANY_VECTOR_STORE_ID"
      });
    }

    const uploadedFiles = [];

    for (const file of uploadedFilesRaw) {
      const uploaded = await uploadSingleFile(file, vectorStoreId);
      uploadedFiles.push(uploaded);
    }

    return res.status(200).json({
      success: true,
      uploadedCount: uploadedFiles.length,
      files: uploadedFiles
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Upload server error"
    });
  }
}
