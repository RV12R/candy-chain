import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployModule = buildModule("DeployModule", (m) => {
  const ownerAddress = m.getAccount(0);

  // Deploy the CRUSHToken contract
  const crushToken = m.contract("CRUSHToken", [ownerAddress]);

  // Deploy the PrizeVault, passing CRUSHToken address and owner
  const prizeVault = m.contract("PrizeVault", [crushToken, ownerAddress]);

  return { crushToken, prizeVault };
});

export default DeployModule;
