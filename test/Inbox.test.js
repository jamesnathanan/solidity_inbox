const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

// UPDATED THESE TWO LINES
const provider = ganache.provider();
const web3 = new Web3(provider);
//const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile");

let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those to deploys
  // The contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["Hi there!"],
    })
    .send({ from: accounts[0], gas: "1000000" });

  inbox.setProvider(provider);
});

describe("Inbox", () => {
  it("deploys a contact", () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    // do something
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hi there!");
  });

  it("can change the message", async () => {
    await inbox.methods.setMessage("Bye").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "Bye");
  });
});
