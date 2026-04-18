const EvidenceManagement = artifacts.require("EvidenceManagement");

module.exports = async function (callback) {
  try {
    const contract = await EvidenceManagement.deployed();
    const account = "0xeD54677E45786485eef8C5b52646a8bDcdbA2da6";
    const name = "Sudarshan Gopal";
    const role = "Police";

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
