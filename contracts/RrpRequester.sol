// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// A Requester that will return the requested data by calling the specified Airnode.
contract RrpRequester is RrpRequesterV0, Ownable, ERC20 {
    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => uint256) public fulfilledData;
    mapping(address => uint256) public amountBet;
    mapping(address => uint256) public driverBetMapping;
    mapping(uint256 => address[]) public driverBettorMapping;

    // This RRP contract will only accept uint256 requests from the Airnode.
    event RequestFulfilled(bytes32 indexed requestId, int256 response);
    event RequestedUint256(bytes32 indexed requestId);

    // Make sure you specify the right _rrpAddress for your chain while deploying the contract.
    constructor(address _rrpAddress) RrpRequesterV0(_rrpAddress) ERC20("betsquared", "BTSQ") {}

    // To receive funds from the sponsor wallet and send them to the owner.
    receive() external payable {
        payable(owner()).transfer(address(this).balance);
    }

    function addBettor(uint256 driverId) external payable {
        require(msg.value >= 0.001 ether);
        amountBet[msg.sender] = msg.value;
        driverBetMapping[msg.sender] = driverId;
        driverBettorMapping[driverId].push(msg.sender);
    }

    function claimWinnings(address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet,
        bytes calldata parameters) external {
            makeRequest(airnode, endpointId, sponsor, sponsorWallet, parameters);
        }

    // The main makeRequest function that will trigger the Airnode request.
    function makeRequest(
        address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet,
        bytes calldata parameters

    ) public {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,                        // airnode address
            endpointId,                     // endpointId
            sponsor,                        // sponsor's address
            sponsorWallet,                  // sponsorWallet
            address(this),                  // fulfillAddress
            this.fulfill.selector,          // fulfillFunctionId
            parameters                      // encoded API parameters
        );
        incomingFulfillments[requestId] = true;
        emit RequestedUint256(requestId);
    }
    
    function fulfill(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(incomingFulfillments[requestId], "No such request made");
        delete incomingFulfillments[requestId];
        int256 decodedData = abi.decode(data, (int256));
        uint256 uDecodedData = uint256(decodedData);
        
        fulfilledData[requestId] = uDecodedData;
        payoutWinnings(decodedData);
        emit RequestFulfilled(requestId, decodedData);
    }

    function payoutWinnings(int256 winnerId) public {
        // winners = driver
        uint256 uWinnerId = uint256(winnerId);
        address[] memory winners = driverBettorMapping[uWinnerId];
        for (uint256 index = 0; index < winners.length; index++) {
            address winnerAddress = winners[index];
            uint256 payoutAmount = amountBet[winnerAddress] * 4 * 1000;
            _mint(winnerAddress, payoutAmount);
        }
    }

    // To withdraw funds from the sponsor wallet to the contract.
    function withdraw(address airnode, address sponsorWallet) external onlyOwner {
        airnodeRrp.requestWithdrawal(
        airnode,
        sponsorWallet
        );
    }
}