export default async function handler(req, res) {
  const vectorStoreId = process.env.COMPANY_VECTOR_STORE_ID;

  if (!vectorStoreId) {
    return res.status(500).json({ error: "Missing COMPANY_VECTOR_STORE_ID" });
  }

  try {
    if (req.method === "GET") {
      const listResponse = await fetch(
        `https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          }
        }
      );

      const listData = await listResponse.json();

      if (!listResponse.ok) {
        return res.status(listResponse.status).json({
          error: listData.error?.message || "Cannot list company files"
        });
      }

      const files = await Promise.all(
        (listData.data || []).map(async (item) => {
          const fileId = item.id;

          const fileResponse = await fetch(
            `https://api.openai.com/v1/files/${fileId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
              }
            }
          );

          const fileData = await fileResponse.json();

          return {
            vectorStoreFileId: item.id,
            fileId,
            name: fileData.filename || fileId,
            status: item.status,
            createdAt: item.created_at
          };
        })
      );

      return res.status(200).json({ files });
    }

    if (req.method === "DELETE") {
      const fileId = req.query.fileId;

      if (!fileId) {
        return res.status(400).json({ error: "Missing fileId" });
      }

      const deleteFromVectorStoreResponse = await fetch(
        `https://api.openai.com/v1/vector_stores/${vectorStoreId}/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          }
        }
      );

      const deleteFromVectorStoreData =
        await deleteFromVectorStoreResponse.json();

      if (!deleteFromVectorStoreResponse.ok) {
        return res.status(deleteFromVectorStoreResponse.status).json({
          error:
            deleteFromVectorStoreData.error?.message ||
            "Cannot remove file from vector store"
        });
      }

      return res.status(200).json({
        success: true,
        removedFromVectorStore: true,
        fileId
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
