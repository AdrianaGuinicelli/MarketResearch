export default async function handler(req, res) {

  return res.status(200).json({
    apiKeyExists: !!process.env.OPENAI_API_KEY,
    envKeys: Object.keys(process.env).filter(k => k.includes("OPENAI"))
  });

}
