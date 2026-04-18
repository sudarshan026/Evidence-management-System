const EvidenceManagement = artifacts.require("EvidenceManagement");

module.exports = async function (callback) {
  try {
    const contract = await EvidenceManagement.deployed();
    const policeAccount = "0xeD54677E45786485eef8C5b52646a8bDcdbA2da6";
    const evidenceId = "EV-1001";

    const count = await contract.getEvidenceCount();
    let exists = false;

    for (let i = 0; i < Number(count); i += 1) {
      const id = await contract.evidenceIds(i);
      if (id === evidenceId) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      await contract.addEvidence(
        evidenceId,
        "local://seed-evidence",
        "CASE-001",
        "City Center",
        "Seed evidence for dashboard verification flow",
        "Document",
        { from: policeAccount }
      );
      console.log(`Added sample evidence ${evidenceId}`);
    } else {
      console.log(`${evidenceId} already exists`);
    }

    const evidence = await contract.getEvidence(evidenceId, { from: policeAccount });
    console.log(`Loaded ${evidenceId}: case=${evidence.caseNumber}, type=${evidence.evidenceType}`);

    callback();
  } catch (error) {
    callback(error);
  }
};
