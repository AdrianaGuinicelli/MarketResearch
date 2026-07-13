export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      researchId,
      researchTitle,
      researchOwner,
      researchProgress,
      managerEmail,
      note
    } = req.body || {};

    if (!researchId || !researchTitle) {
      return res.status(400).json({
        error: "Missing research information"
      });
    }

    if (Number(researchProgress) < 100) {
      return res.status(400).json({
        error:
          "The research must be completed before it can be submitted for approval."
      });
    }

    if (!managerEmail) {
      return res.status(400).json({
        error: "Missing manager email"
      });
    }

    const requestId = `approval_${Date.now()}`;

    const approvalRequest = {
      id: requestId,
      researchId,
      researchTitle,
      researchOwner: researchOwner || "Current user",
      researchProgress: Number(researchProgress),
      managerEmail,
      note: note?.trim() || "",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    /*
      MOC:
      la richiesta viene validata e restituita al frontend.

      Prossima evoluzione:
      - salvataggio su database;
      - invio email al manager;
      - collegamento ai documenti della ricerca;
      - schermata manager Approve / Reject.
    */

    return res.status(201).json({
      success: true,
      message: "Research submitted for manager approval.",
      approvalRequest
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Approval request server error"
    });
  }
}
