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

    const scope = fields.scope?.[0] || fields.scope || "research";
    const uploadedFile = files.file?.[0] || files.file;

    if (!uploadedFile) {
      return res.status(400).json({ error: "Missing file" });
    }

    const fileStream = fs.createReadStream(uploadedFile.filepath);

    const uploadResponse = await fetch("https://api.openai.com/v1/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: (() => {
        const formData = new FormData();
        formData.append("purpose", "assistants");
        formData.append(
          "file",
          new Blob([fs.readFileSync(uploadedFile.filepath)]),
          uploadedFile.originalFilename || "uploaded_file"
        );
        return formData;
      })()
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      return res.status(uploadResponse.status).json({
        error: uploadData.error?.message || "OpenAI file upload error"
      });
    }

    return res.status(200).json({
      success: true,
      scope,
      file: {
        id: uploadData.id,
        name: uploadedFile.originalFilename,
        type: uploadedFile.mimetype
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Upload server error"
    });
  }
}
