const EvidenceManagement = artifacts.require("EvidenceManagement");

module.exports = async function (callback) {
  try {
    const contract = await EvidenceManagement.deployed();
    const account = "0x50F3336Ec31276C50e93e69DDc2FFd139E8a9ABB";
    const name = "Court Officer";
    const role = "Court";

    const isRegistered = await contract.isUserRegistered(account);

    if (!isRegistered) {
      await contract.registerUser(name, role, { from: account });
      console.log(`Registered ${account} as ${role}`);
    } else {
      console.log(`${account} is already registered`);
    }

    const savedRole = await contract.getUserRole(account);
    const savedName = await contract.getUserName(account);
    console.log(`On-chain user => name: ${savedName}, role: ${savedRole}`);

    callback();
  } catch (error) {
    callback(error);
  }
};
