const GLDToken = artifacts.require("GLDToken");

module.exports = function(_deployer) {
  _deployer.deploy(GLDToken, 1e5);
};
