import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

function parseForm(req) {
  const form = formidable({
    multiples: false,
    keepExtensions: true
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);

    const scope = fields.scope?.[0] || fields.scope || "company";
    const uploadedFile = files.file?.[0] || files.file;

    if (!uploadedFile) {
      return res.status(400).json({ error: "Missing file" });
    }

    const vectorStoreId = process.env.COMPANY_VECTOR_STORE_ID;

    if (!vectorStoreId) {
      return res.status(500).json({
        error: "Missing COMPANY_VECTOR_STORE_ID"
      });
    }

    const fileUploadForm = new FormData();
    fileUploadForm.append("purpose", "assistants");
    fileUploadForm.append(
      "file",
      new Blob([fs.readFileSync(uploadedFile.filepath)]),
      uploadedFile.originalFilename || "uploaded_file"
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
      return res.status(uploadResponse.status).json({
        error: uploadData.error?.message || "OpenAI file upload error"
      });
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
      return res.status(attachResponse.status).json({
        error: attachData.error?.message || "Vector store attach error"
      });
    }

    return res.status(200).json({
      success: true,
      scope,
      vectorStoreId,
      file: {
        id: uploadData.id,
        name: uploadedFile.originalFilename,
        type: uploadedFile.mimetype,
        vectorStoreFileId: attachData.id
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Upload server error"
    });
  }
}
