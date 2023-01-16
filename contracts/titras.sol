// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./titrasStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
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

contract Triterras is AccessControl {
    bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");
    bytes32 public constant TRADER_ROLE = keccak256("TRADER_ROLE");
    bytes32 public constant SELLER_ROLE = keccak256("SELLER_ROLE");

     string private baseUri;

     constructor (string memory uri) {
     baseUri=uri;  
     _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
     _grantRole(BUYER_ROLE, msg.sender);
     _grantRole(TRADER_ROLE, msg.sender);
     _grantRole(SELLER_ROLE, msg.sender);
    }


    using titrasStorage for titrasStorage.trading;
    mapping (uint256=>titrasStorage.trading)public _trading;

    using EnumerableSet for EnumerableSet.UintSet;
    EnumerableSet.UintSet private totalTradingNumbers;

     function updateBaseUri(string memory uri)public onlyRole(DEFAULT_ADMIN_ROLE){
     baseUri=uri;
    }

    function _baseURI() internal view  returns (string memory) {
    return baseUri;
    }

    function totalTrades() public view returns(uint256) {
        return totalTradingNumbers.length();
    }
    function totalTradesNumberByIndex(uint256 index) public view returns(uint256) {
        return totalTradingNumbers.at(index);
    }

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

    function createOrder(
        uint256 tradeNumber,
        string memory assetName,
        address walletAddress,
        uint256 totalAmount,
        uint256 tradeType
        
    )external
    {
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
     // details
    function OrderDetails(uint256 _tradeNumber)public view returns(
        address,
        address,
        uint256,
        string memory,
        string memory,
        string memory,
        string memory,
        bool){
        return _trading[_tradeNumber]._tradingDetails();
    }

    //agree to trade
     function agreeToTrade(uint256 tradeNumber)public {
        if(!_trading[tradeNumber].peelTradeNumber()){revert InvalidTradeNumber();}
        if(_trading[tradeNumber].isAcceptTrading()){revert AllReadyAgreed();}
        if(_trading[tradeNumber].tradingType()==1 || _trading[tradeNumber].tradingType()==2)
        {
            if(_trading[tradeNumber].tradingToAddress()!=msg.sender){revert InvalidCallerAddress();}
        }else if(_trading[tradeNumber].tradingType()==3)
        {
            if(_trading[tradeNumber].tradingFromAddress()!=msg.sender){revert InvalidCallerAddress();}
        }else{
         revert InvalidTradeType();
        }
      

      _trading[tradeNumber].setAcceptTrading();     
    }


       //Trader updating LC so the seller can accept LC or reject it
    function updateLC(uint256 tradeNumber,string memory hash)public{
      if(!_trading[tradeNumber].peelTradeNumber()){revert InvalidTradeNumber();}
      if(!_trading[tradeNumber].isTradingLCHashEmpty()){revert AllreadyAdd();}
      if(!_trading[tradeNumber].isAcceptTrading()){revert NotAcceptedYet();}
      if(_trading[tradeNumber].tradingToAddress()!=msg.sender){revert InvalidCallerAddress();}
      _trading[tradeNumber].setTradingLC(hash);
    }

     //verifying LC 
    function verifyLC(uint256 tradeNumber,string memory hash)public{
      if(!_trading[tradeNumber].peelTradeNumber()){revert InvalidTradeNumber();}
      if(!_trading[tradeNumber].isTradingVerifyLCHashEmpty()){revert AllreadyAdd();}
      if(_trading[tradeNumber].isTradingLCHashEmpty()){revert LcNotAddYet();}
      if(_trading[tradeNumber].tradingFromAddress()!=msg.sender){revert InvalidCallerAddress();}
      _trading[tradeNumber].setVerifyTradingLC(hash);
    }

    //trading LC Hash
    function getIssueLcHash(uint256 tradeNumber) public virtual view returns(string memory) {
    if(!_trading[tradeNumber].peelTradeNumber()){revert InvalidTradeNumber();}
    string memory baseURI = _baseURI();
    string memory hash=_trading[tradeNumber].tradingIssueLC();
    return
        bytes(baseURI).length > 0
        ? string(abi.encodePacked(baseURI,hash))
        : "";   
    }


    //updateing BL
     function updateBL(uint256 tradeNumber,string memory hash)public{
      if(!_trading[tradeNumber].peelTradeNumber()){revert InvalidTradeNumber();}
      if(!_trading[tradeNumber].isTradingBlHashEmpty()){revert AllreadyAdd();}
      if(_trading[tradeNumber].isTradingVerifyLCHashEmpty()){revert LCNotVerifyYet();}
      if(_trading[tradeNumber].tradingFromAddress()!=msg.sender){revert InvalidCallerAddress();}
      _trading[tradeNumber].setTradingBL(hash);
    }
    
    //verifying BL
    function verifyBL(uint256 tradeNumber,string memory hash)public{
      if(!_trading[tradeNumber].peelTradeNumber()){revert InvalidTradeNumber();}
      if(!_trading[tradeNumber].isTradingVerifyBLHashEmpty()){revert AllreadyAdd();}
      if(_trading[tradeNumber].isTradingBlHashEmpty()){revert NotBLAddedYet();}
      if(_trading[tradeNumber].tradingToAddress()!=msg.sender){revert InvalidCallerAddress();}
      _trading[tradeNumber].setVerifyTradingBL(hash);
    }

   
    //Trading BL Hash
     function getAllHash(uint256 tradeNumber) public virtual view returns(string memory,string memory,string memory,string memory) {
        if(!_trading[tradeNumber].peelTradeNumber()){revert InvalidTradeNumber();}
        string memory baseURI = _baseURI();
        string memory hash = _trading[tradeNumber].tradingIssueLC();
        string memory hash1 = _trading[tradeNumber].tradingVerifyLC();
        string memory hash2=_trading[tradeNumber].tradingBlHash();
        string memory hash3 = _trading[tradeNumber].tradingVerifyBL();
        return (
            bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI,hash))
            : "",
            bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI,hash1))
            : "",
            bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI,hash2))
            : "",
             bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI,hash3))
            : ""
         );
    }


 

    // get All matter number
    function allTradingNumbers() public view returns(uint256[] memory) {
        uint256 tradingNumbers = totalTrades();
        uint256[] memory trades = new uint256[](tradingNumbers);
        for (uint256 index = 0; index < tradingNumbers; ++index) {
            uint256 tradingNumber = totalTradesNumberByIndex(index);
            trades[index] = tradingNumber;
        }
        return trades;
    }

    function batchDetailsTrades(uint256[] memory tradingNumbers) public view returns(titrasStorage.trading[] memory) {
        titrasStorage.trading[] memory detailsTrades = new titrasStorage.trading[](tradingNumbers.length);
        for (uint256 index = 0; index < tradingNumbers.length; ++index) {
            detailsTrades[index] = _trading[tradingNumbers[index]];
        }
        return detailsTrades;
    }


    
    
}
