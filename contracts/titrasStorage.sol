// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
library titrasStorage  {
  struct trading {
        uint256 tradeNumber;
        string assetName;
        address fromAddress;
        address toAddress;
        uint256 totalAmount;
        string LcHash;
        string verifyLC;
        string blHash;
        string verifyBl;
        bool  acceptTrade;
        uint256 tradeType;
    }
    function set(
        trading storage self,
        uint256 _tradeNumber,
        string memory _assetName,
        address _fromAddress,
        address _toAddress,
        uint256 _totalAmount,
        uint256 _tradeType
       
        
        ) internal {
      self.tradeNumber =_tradeNumber;
      self.assetName=_assetName; 
      self.fromAddress =_fromAddress;
      self.toAddress=_toAddress;
      self.totalAmount=_totalAmount;
      self.tradeType=_tradeType;


    }

     function _tradingDetails(
        trading storage self
    ) internal view returns( 
        address,
        address,
        uint256,
        string memory,
        string memory,
        string memory,
        string memory,
        bool) 
    {
        return (
          
          self.fromAddress,
          self.toAddress,
          self.totalAmount,
          self.LcHash,
          self.blHash,
          self.verifyLC,
          self.verifyBl,
          self.acceptTrade

        );
    }

     function setAcceptTrading(
    trading storage self
    )internal
    {
        self.acceptTrade=true;
    }

    function setTradingBL(
    trading storage self,
    string memory _blHash
    )internal
    {
        self.blHash=_blHash;
    }

    function setVerifyTradingBL(
    trading storage self,
     string memory _blHash
    )internal
    {
        self.verifyBl=_blHash;
    }


//LC functions list
    function setTradingLC( 
    trading storage self,
    string memory _LcHash
    )internal{
        self.LcHash=_LcHash;
    }
   
    function setVerifyTradingLC(
    trading storage self,
    string memory _LcHash
    )internal
    {
        self.verifyLC=_LcHash;
    }

    function peelTradeNumber(
        trading storage self
    )internal view returns(bool)
    {
        if(self.tradeNumber!=0)
        {
           return true;
        }
        return false;
    }
    

    function tradingAssetName(
     trading storage self
    )internal view returns(string memory)
    {
        return self.assetName;
    }

    function tradingTotalAmount(
     trading storage self
    )internal view returns(uint256)
    {
        return self.totalAmount;
    }

    function tradingFromAddress(
     trading storage self
    )internal view returns(address)
    {
        return self.fromAddress;
    }

    function tradingToAddress(
     trading storage self
    )internal view returns(address)
    {
        return self.toAddress;
    }

    function isAcceptTrading(
    trading storage self
    )internal view returns(bool)
    {
        return self.acceptTrade;
    }
    

    //issueLC
    function tradingIssueLC(
    trading storage self
    )internal view returns(string memory)
    {
       return self.LcHash;
    }

    //verify LC

    function tradingVerifyLC(
    trading storage self
    )internal view returns(string memory)
    {
       return self.verifyLC;
    }

    //BL Hash

    function tradingBlHash(
    trading storage self
    )internal view returns(string memory){
       return self.blHash;
    }

    // verify BL hash
    function tradingVerifyBL(
    trading storage self
    )internal view returns(string memory)
    {
       return self.verifyBl;
    }

    function isTradingBlHashEmpty(
    trading storage self
    )internal view returns(bool){
       return bytes(self.blHash).length == 0;
    }


    //Checking  LC Hash is empty or not
     function isTradingLCHashEmpty(
    trading storage self
    )internal view returns(bool){
       return bytes(self.LcHash).length == 0;
    }
    //Checking  verifying bl Hash is empty or not
     function isTradingVerifyBLHashEmpty(
    trading storage self
    )internal view returns(bool){
       return bytes(self.verifyBl).length == 0;
    }


     //Checking  verifying LC Hash is empty or not
     function isTradingVerifyLCHashEmpty(
    trading storage self
    )internal view returns(bool){
       return bytes(self.verifyLC).length == 0;
    }

    
    function tradingType(
    trading storage self
    )internal view returns(uint256){
        return self.tradeType;
    }
    

}