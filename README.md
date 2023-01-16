About Contract
This is a smart contract written in Solidity, a programming language for the Ethereum blockchain. The contract is called "Triterras" and it is a trading platform for different assets. The contract imports other contracts, such as "titrasStorage" and "AccessControl" from OpenZeppelin. It also defines several error types. The contract uses an AccessControl library to manage role-based access control for the different types of users on the platform: buyers, sellers, and traders. The contract also creates a mapping for storing trading information and an EnumerableSet to keep track of the total number of trades. The contract has several functions, including ones for creating an order, updating the base URI, and getting the total number of trades.

//code with explaination
// SPDX-License-Identifier: MIT
This line is a comment that specifies the license for the code in the contract, in this case, it is the MIT License.

pragma solidity ^0.8.17;
This line specifies the version of the Solidity compiler that should be used to compile the contract.

import "./titrasStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
These lines import other contracts that are used by the Triterras contract. The first line imports a contract called "titrasStorage", the second imports the AccessControl contract from the OpenZeppelin library, and the third imports the EnumerableSet contract from OpenZeppelin.

error InvalidTradeNumber();
error InvalidSeller();
error InvalidTrader();
error InvalidBuyer();
error InvalidTradeType();
error AllReadyAgreed();
error InvalidCallerAddress();
error NotAcceptedYet();
error NotBLAddedYet();
error LcNotAddYet();
error AllreadyAdd();
error LCNotVerifyYet();
These lines define several error types that can be thrown by the contract. Each error type corresponds to a specific exception that can occur while executing the contract.

contract Triterras is AccessControl {
bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");
bytes32 public constant TRADER_ROLE = keccak256("TRADER_ROLE");
bytes32 public constant SELLER_ROLE = keccak256("SELLER_ROLE");
This is the definition of the Triterras contract and it inherits from the AccessControl contract. The following three lines define constants for the different roles that users can have on the platform: buyer, trader, and seller. The keccak256 function is used to hash the string representation of the role and create a unique identifier for it.

string private baseUri;
This line creates a private variable "baseUri" of type string.

constructor (string memory uri) {
baseUri=uri;
_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
_grantRole(BUYER_ROLE, msg.sender);
_grantRole(TRADER_ROLE, msg.sender);
_grantRole(SELLER_ROLE, msg.sender);
}
This is the constructor of the contract, which is called when the contract is deployed. It accepts a single argument, "uri", which is used to set the value of the "baseUri" variable. The constructor also grants the default admin role, as well as the buyer, trader, and seller roles to the sender of the deployment transaction.

using titrasStorage for titrasStorage.trading;
mapping (uint256=>titrasStorage.trading)public _trading;

using EnumerableSet for EnumerableSet.UintSet;
EnumerableSet.UintSet private totalTradingNumbers;
These two lines use the "using for" statement to create an alias for the "titrasStorage.trading" and "EnumerableSet.UintSet" types, so that they can be used more easily later on in the contract. 

function updateBaseUri(string memory uri)public onlyRole(DEFAULT_ADMIN_ROLE){
baseUri=uri;
}
This function allows the user with the DEFAULT_ADMIN_ROLE to update the base URI of the contract. The "onlyRole" modifier is used to ensure that only users with the DEFAULT_ADMIN_ROLE can execute this function.

function _baseURI() internal view returns (string memory) {
return baseUri;
}
This is an internal function that returns the value of the "baseUri" variable. The "view" keyword is used to indicate that this function does not modify the state of the contract and the "internal" keyword is used to indicate that this function can only be called from within the contract itself.

function totalTrades() public view returns(uint256) {
return totalTradingNumbers.length();
}
This function returns the total number of trades that have been made on the platform by returning the length of the "totalTradingNumbers" EnumerableSet. The "view" keyword is used to indicate that this function does not modify the state of the contract.

function totalTradesNumberByIndex(uint256 index) public view returns(uint256) {
return totalTradingNumbers.at(index);
}
This function returns the trade number at a given index in the "totalTradingNumbers" EnumerableSet. The "view" keyword is used to indicate that this function does not modify the state of the contract.

function _createOrder(
uint256 _tradeNumber,
string memory _assetName,
address _fromAddress,
address _toAddress,
uint256 _totalAmount,
uint256 _tradeType
)internal{
uint id=_tradeNumber;
_trading[id].set(
_tradeNumber,
_assetName,
_fromAddress,
_toAddress,
_totalAmount,
_tradeType
);
}
This is an internal function that creates an order for a trade. It takes several parameters including a trade number, asset name, sender and recipient addresses, total amount, and trade type. It creates an order by calling the "set" function on the "_trading" mapping and passing in the provided parameters. The "internal" keyword is used to indicate that this function can only be called from within the contract itself.
function createOrder(
uint256 tradeNumber,
string memory assetName,
address walletAddress,
uint256 totalAmount,
uint256 tradeType
) external {
address fromAddress;
address toAddress;
if(_trading[tradeNumber].peelTradeNumber()){revert InvalidTradeNumber();}
if(tradeType==1){ //Seller To Trader
if(!hasRole(SELLER_ROLE,msg.sender)){revert InvalidSeller();}
if(!hasRole(TRADER_ROLE,walletAddress)){revert InvalidTrader();}
fromAddress = msg.sender;
toAddress = walletAddress;
}else if(tradeType==2){ //Trader To Buyer
if(!hasRole(TRADER_ROLE,msg.sender)){revert InvalidTrader();}
 if(!hasRole(BUYER_ROLE,walletAddress)){revert InvalidBuyer();}
        fromAddress = msg.sender;
        toAddress = walletAddress;
      }else if(tradeType==3){ //Buyer To Trader
        if(!hasRole(BUYER_ROLE,msg.sender)){revert InvalidBuyer();}
        if(!hasRole(TRADER_ROLE,walletAddress)){revert InvalidTrader();}
        fromAddress = walletAddress;
        toAddress = msg.sender;
      }else{
          revert InvalidTradeType();
      }

     _createOrder(
            tradeNumber,
            assetName,
            fromAddress,
            toAddress,
            totalAmount,
            tradeType
            
     );
     totalTradingNumbers.add(tradeNumber);

    }
    
if(_trading[tradeNumber].peelTradeNumber()){revert AllReadyAgreed();}
if(msg.sender != fromAddress){revert InvalidCallerAddress();}
if(!_trading[tradeNumber].peelAccepted()){revert NotAcceptedYet();}
if(!_trading[tradeNumber].peelBLAdded()){revert NotBLAddedYet();}
if(!_trading[tradeNumber].peelLcAdded()){revert LcNotAddYet();}
if(_trading[tradeNumber].peelLcAdded()){revert AllreadyAdd();}
if(!_trading[tradeNumber].peelLcVerified()){revert LCNotVerifyYet();}
_trading[tradeNumber].setAccepted();
_trading[tradeNumber].setBLAdded();
_trading[tradeNumber].setLcAdded();
_trading[tradeNumber].setLcVerified();
totalTradingNumbers.add(tradeNumber);
_createOrder(tradeNumber, assetName, fromAddress, toAddress, totalAmount, tradeType);
}

This function allows a user to create an order for a trade. It takes several parameters including a trade number, asset name, wallet address, total amount, and trade type. It first checks the trade type and verifies that the sender has the appropriate role (buyer, trader, or seller) and that the wallet address has the appropriate role (trader or buyer). It also checks if the trade has already been agreed, accepted, has bill of lading added, letter of credit added, and letter of credit verified. If any of these conditions are not met, it reverts with an appropriate error. If all conditions are met, it sets the trade as accepted, bill of lading added, letter of credit added, letter of credit verified, and adds the trade number to the totalTradingNumbers EnumerableSet. It also calls the internal _createOrder function with the provided parameters to create the order for the trade.