const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Triterras", function () {
    let owner;
    let triterras;
    let seller;
    let trader;
    let trader1;
    let buyer;
    let buyer1;

    it("deployment", async () => {
        [owner, triterras, seller, trader, trader1, buyer, buyer1] = await ethers.getSigners();
        console.log("owner", owner.address);

        //***************************************deploy triterras***************************************
        const Triterras = await ethers.getContractFactory("Triterras");
        triterras = await Triterras.deploy("tritras/");
        triterras.deployed();


    })

    //***************************************assign role to seller trader and buyer***************************************
    it("assigning a role to seller ", async () => {
        const role = await triterras.SELLER_ROLE();
        const asign = await triterras.connect(owner).grantRole(role, seller.address);
        expect(await triterras.hasRole(role, seller.address)).to.equal(true);
    })

    it("assigning a role to trader ", async () => {
        const role = await triterras.TRADER_ROLE();
        const asign = await triterras.grantRole(role, trader.address);
        expect(await triterras.hasRole(role, trader.address)).to.equal(true);
    })

    it("assigning a role to buyer ", async () => {
        const role = await triterras.BUYER_ROLE();
        const asign = await triterras.grantRole(role, buyer.address);
        expect(await triterras.hasRole(role, buyer.address)).to.equal(true);
    })


    //***************** Seller to Trader***************************


    //*****************failing Trade Order By invalid seller  ***************************
    it("create a new trade Order by Trader not by seller", async () => {
        const tradeNumber = 1;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 1; // Seller to Trader
        try {
            await triterras.connect(trader).createOrder(tradeNumber, assetName, trader.address, totalAmount, tradeType);
        } catch (error) {
            console.log("ERROR", error.message);
        }
    });

    //*****************failing Trade Order By Seller by adding invalide Trader that doesnot approved as a trader***********

    it("invalid Trader", async () => {
        const tradeNumber = 1;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 1; // Seller to Trader
        try {
            await triterras.connect(seller).createOrder(tradeNumber, assetName, trader1.address, totalAmount, tradeType);
        } catch (error) {
            console.log("ERROR", error.message);
        }
    });

    //*****************failing Trade Order By Trader Not Seller invalide Trade Type***************************
    it("create a new trade for seller but wrong trade Type", async () => {
        const tradeNumber = 1;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 2; // Seller to Trader
        try {
            await triterras.connect(seller).createOrder(tradeNumber, assetName, trader.address, totalAmount, tradeType);
        } catch (error) {
            console.log("ERROR", error.message);
        }
    });

    //***************************************create new seller Order***************************************

    it("create a new trade Order", async () => {
        const tradeNumber = 1;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 1; // Seller to Trader
        await triterras.connect(seller).createOrder(tradeNumber, assetName, trader.address, totalAmount, tradeType);

        const order = await triterras._trading(tradeNumber);
        expect(order.tradeNumber).to.equal(tradeNumber);
        expect(order.assetName).to.equal(assetName);
        expect(order.fromAddress).to.equal(seller.address);
        expect(order.toAddress).to.equal(trader.address);
        expect(order.totalAmount).to.equal(totalAmount);
        expect(order.tradeType).to.equal(tradeType);
    });


    //*****************Trader to Buyer***************************

    //*****************failing Trade Order By invalid Trader**************************

    it("failing Trade Order By invalid Trader", async () => {
        const tradeNumber = 2;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 2; //Trader To Buyer
        try {
            await triterras.connect(trader1).createOrder(tradeNumber, assetName, buyer.address, totalAmount, tradeType);
        } catch (error) {
            console.log("ERROR", error.message);
        }
    });

    //*****************failing Trade Order By trader Number THat already Exist**************************
    it("failing Trade Order By invalid Trader", async () => {
        const tradeNumber = 1;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 2; //Trader To Buyer
        try {
            await triterras.connect(trader).createOrder(tradeNumber, assetName, buyer.address, totalAmount, tradeType);
        } catch (error) {
            console.log("ERROR", error.message);
        }
    });
    //*****************failing Trade Order By Invalid Trade Type**************************
    it("Invalid Trade Type", async () => {
        const tradeNumber = 2;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 3; //Trader To Buyer
        try {
            await triterras.connect(trader).createOrder(tradeNumber, assetName, buyer.address, totalAmount, tradeType);
        } catch (error) {
            console.log("ERROR", error.message);
        }
    });

    //*****************create new Trader Order **************************
    it("Creating New Order by Trader", async () => {
        const tradeNumber = 2;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 2; //Trader To Buyer

        await triterras.connect(trader).createOrder(tradeNumber, assetName, buyer.address, totalAmount, tradeType);
        const order = await triterras._trading(tradeNumber);
        expect(order.tradeNumber).to.equal(tradeNumber);
        expect(order.assetName).to.equal(assetName);
        expect(order.fromAddress).to.equal(trader.address);
        expect(order.toAddress).to.equal(buyer.address);
        expect(order.totalAmount).to.equal(totalAmount);
        expect(order.tradeType).to.equal(tradeType);

    });


    //*****************Buyer To Trader**************************

    //*****************failing Buyer Order by creating buyer that doesnot approved**************************

    it("failing Trade Order By invalid Buyer", async () => {
        const tradeNumber = 3;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 3; // Buyer to Trader
        try {
            await triterras.connect(buyer1).createOrder(tradeNumber, assetName, trader.address, totalAmount, tradeType);
        } catch (error) {
            console.log("ERROR", error.message);
        }
    });

    //*****************failing Trade Order By Invalid Trade Type**************************
    it("failing Trade Order By invalid Buyer", async () => {
        const tradeNumber = 3;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 2; // Buyer to Trader
        try {
            await triterras.connect(buyer).createOrder(tradeNumber, assetName, trader.address, totalAmount, tradeType);
        } catch (error) {
            console.log("ERROR", error.message);
        }
    });

    //*****************failing Trade Order By trader Number That already Exist**************************
    it("failing Trade Order By invalid Buyer", async () => {
        const tradeNumber = 2;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 3; // Buyer to Trader
        try {
            await triterras.connect(buyer).createOrder(tradeNumber, assetName, trader.address, totalAmount, tradeType);
        } catch (error) {
            console.log("ERROR", error.message);
        }
    });

    //*****************create new Buyer Order **************************
    it("Creating New Order by Buyer", async () => {
        const tradeNumber = 3;
        const assetName = "asset 1"
        const totalAmount = 100;
        const tradeType = 3; //Buyer TO Trader

        await triterras.connect(buyer).createOrder(tradeNumber, assetName, trader.address, totalAmount, tradeType);
        const order = await triterras._trading(tradeNumber);
        expect(order.tradeNumber).to.equal(tradeNumber);
        expect(order.assetName).to.equal(assetName);
        expect(order.fromAddress).to.equal(trader.address);
        expect(order.toAddress).to.equal(buyer.address);
        expect(order.totalAmount).to.equal(totalAmount);
        expect(order.tradeType).to.equal(tradeType);

    });

    //***************************************Detail about Order***************************************
    // it("geting Details About order",async()=>{
    //     const  tradeNumber=1;
    //     const order=await triterras.OrderDetails(tradeNumber);
    //     console.log(order,"order Details");
    // })
    // it("getting Details of All",async ()=>{
    //     const order=await triterras.batchDetailsTrades([1,2,3]);
    //     console.log(order,"order Details");
    // })

    //***************************************Agreed To Trade by unAPPROVED ADDRESS***************************************
    //seller to Trader
    it("agree To Trade by Unapproved Address", async () => {
        try {
            const tradeNumber = 1;
            await triterras.connect(trader1).agreeToTrade(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }

    })
    //Trader to buyer
    it("agree To Trade by Unapproved Address", async () => {
        try {
            const tradeNumber = 2;
            await triterras.connect(buyer1).agreeToTrade(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }

        //Buyer to Trader
        try {
            const tradeNumber = 3;
            await triterras.connect(trader1).agreeToTrade(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }

    })

    //***************************************Agreed To Trade***************************************
    //seller to Trader
    it("agree To Trade", async () => {
        const tradeNumber = 1;
        await triterras.connect(trader).agreeToTrade(tradeNumber);
        // const order=await triterras.OrderDetails(tradeNumber);
        // console.log(order,"order Details");
    })
    //trader to Buyer
    it("agree To Trade", async () => {
        const tradeNumber = 2;
        await triterras.connect(buyer).agreeToTrade(tradeNumber);
        // const order=await triterras.OrderDetails(tradeNumber);
        // console.log(order,"order Details");
    })
    //Buyer To Trader
    it("agree To Trade", async () => {
        const tradeNumber = 3;
        await triterras.connect(trader).agreeToTrade(tradeNumber);
        // const order=await triterras.OrderDetails(tradeNumber);
        // console.log(order,"order Details");
    })

    //***************************************Updating LC Failing***************************************
    //seller to Trader
    it("update LC by seller ITself", async () => {
        try {
            await triterras.connect(seller).updateLC(1, "hiterslash");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })
    it("update LC by trader of others TradeNumber", async () => {
        try {
            await triterras.connect(trader).updateLC(2, "hiterslash");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })


    //Trader to Buyer
    it("update LC by Trader itself ", async () => {
        try {
            await triterras.connect(trader).updateLC(2, "trader To BUYER");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }

    })

    it("update LC by Buyer of others TradeNumber", async () => {
        try {
            await triterras.connect(buyer).updateLC(3, "hiterslash");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })



    //***************************************Updating LC ***************************************
    //seller to Trader
    it("update LC ", async () => {
        await triterras.connect(trader).updateLC(1, "seller to trader");
        // const order=await triterras.OrderDetails(1);
        // console.log(order,"order Details");

    })
    //Trader to Buyer
    it("update LC ", async () => {
        await triterras.connect(buyer).updateLC(2, "trader To BUYER");
        // const order=await triterras.OrderDetails(2);
        // console.log(order,"order Details");

    })
    //Buyer To Trader
    it("update LC ", async () => {
        await triterras.connect(buyer).updateLC(3, "BUYER To Trader");
        // const order=await triterras.OrderDetails(3);
        // console.log(order,"order Details");
    })
    //***************************************Verify LC Failing ***************************************
    //seller to Trader
    it("Verify LC Seller to Trader with Wrong Trade Number", async () => {
        try {
            const tradeNumber = 2;
            await triterras.connect(seller).verifyLC(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }

    })

    it("Verify LC Seller to Trader with Trade Number That doesnot exist", async () => {
        try {
            const tradeNumber = 103;
            await triterras.connect(seller).verifyLC(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidTradeNumber()'");
        }

    })

    it("Verify LC Seller to Trader with Trader Address", async () => {
        try {
            const tradeNumber = 1;
            await triterras.connect(trader).verifyLC(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })

    //Trader to Buyer
    it("Verify LC Trader to Buyer with Wrong Trade Number", async () => {
        try {
            const tradeNumber = 1;
            await triterras.connect(trader).verifyLC(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })

    it("Verify LC Trader to Buyer with Trade Number That doesnot exist", async () => {
        try {
            const tradeNumber = 101;
            await triterras.connect(trader).verifyLC(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidTradeNumber()'");
        }
    })

    it("Verify LC Trader to Buyer with Buyer Address", async () => {
        try {
            const tradeNumber = 2;
            await triterras.connect(buyer).verifyLC(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })
    //BuyertoTrader
    it("Verify LC buyer to Trader with wrong trade Number", async () => {
        try {
            const tradeNumber = 1;
            await triterras.connect(trader).verifyLC(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })
    it("Verify LC buyer to Trader with Trade Number That doesnot exist", async () => {
        try {
            const tradeNumber = 101;
            await triterras.connect(trader).verifyLC(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidTradeNumber()'");
        }
    })
    it("Verify LC buyer to Trader with buyer Address", async () => {
        try {
            const tradeNumber = 3;
            await triterras.connect(buyer).verifyLC(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })



    //***************************************Verify LC ***************************************
    //seller to Trader
    it("Verify LC Seller to Trader", async () => {
        const tradeNumber = 1;
        await triterras.connect(seller).verifyLC(tradeNumber);
        // const order=await triterras.OrderDetails(1);
        // console.log(order,"order Details");
    })
    //Trader to Buyer
    it("Verify LC Trader to Buyer", async () => {
        const tradeNumber = 2;
        await triterras.connect(trader).verifyLC(tradeNumber);
        // const order=await triterras.OrderDetails(2);
        // console.log(order,"order Details");
    })
    //Buyer To Trader
    it("Verify LC Buyer to Trader", async () => {
        const tradeNumber = 3;
        await triterras.connect(trader).verifyLC(tradeNumber);
        // const order=await triterras.OrderDetails(3);
        // console.log(order,"order Details");
    })
    //***************************************getIssueLcHash Failing ***************************************

    it("getIssueLcHash of tradenumber that doesnot exist", async () => {
        try {
            const tradeNumber = 110;
            const hash = await triterras.getIssueLcHash(tradeNumber);
        } catch (error) {

        }

    })
    //***************************************getIssueLcHash ***************************************
    //seller to trader hash
    it("getIssueLcHash", async () => {
        const tradeNumber = 1;
        const hash = await triterras.getIssueLcHash(tradeNumber);
        // console.log(hash,"hash");
    })

    //trader To BUYER hash
    it("getIssueLcHash", async () => {
        const tradeNumber = 2;
        const hash = await triterras.getIssueLcHash(tradeNumber);
        // console.log(hash,"hash");
    })

    //BUYER To Trader hash
    it("getIssueLcHash", async () => {
        const tradeNumber = 3;
        const hash = await triterras.getIssueLcHash(tradeNumber);
        // console.log(hash,"hash");
    })

    //***************************************update BL Failing***************************************
    //Seller to Trader
    it("updating BL seller to Trader with Wrong Address", async () => {
        try {
            const BL = 1;
            await triterras.connect(buyer).updateBL(BL, "sellertotrader UpdateBL");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })

    it("updating BL seller to Trader with Wrong TradeNumber", async () => {
        try {
            const BL = 2;
            await triterras.connect(seller).updateBL(BL, "sellertotrader UpdateBL");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })
    it("updating BL seller to Trader with TradeNumber that doesnot exist", async () => {
        try {
            const BL = 201;
            await triterras.connect(seller).updateBL(BL, "sellertotrader UpdateBL");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidTradeNumber()'");
        }
    })

    //trader to Buyer 
    it("updating BL Trader to Buyer with Wrong Address", async () => {
        try {
            const BL = 2;
            await triterras.connect(buyer).updateBL(BL, "trader to Buyer UpdateBL");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })

    it("updating BL Trader to Buyer with Wrong TradeNumber", async () => {
        try {
            const BL = 1;
            await triterras.connect(trader).updateBL(BL, "trader to Buyer UpdateBL");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })

    it("updating BL trader to Buyer with TradeNumber that doesnot exist", async () => {
        try {
            const BL = 201;
            await triterras.connect(trader).updateBL(BL, "trader to Buyer UpdateBL");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidTradeNumber()'");
        }
    })

    //Buyer to Trader
    it("updating BL Buyer to Trader with Wrong Address", async () => {
        try {
            const BL = 2;
            await triterras.connect(buyer).updateBL(BL, "trader to Buyer UpdateBL");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })

    it("updating BL Buyer to Trader with Wrong TradeNumber", async () => {
        try {
            const BL = 1;
            await triterras.connect(trader).updateBL(BL, "Buyer to Trader UpdateBL");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })

    it("updating BL  Buyer to Trader with TradeNumber that doesnot exist", async () => {
        try {
            const BL = 201;
            await triterras.connect(trader).updateBL(BL, "Buyer to Trader UpdateBL");
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidTradeNumber()'");
        }
    })


    //***************************************update BL***************************************
    //Seller to Trader
    it("updating BL seller to Trader", async () => {
        const BL = 1;
        await triterras.connect(seller).updateBL(BL, "sellertotrader UpdateBL");
        // const order=await triterras.OrderDetails(BL);
        // console.log(order,"order Details");         
    })

    //trader to Buyer
    it("updating BL trader to Buyer", async () => {
        const BL = 2;
        await triterras.connect(trader).updateBL(BL, "Trader to Buyer UpdateBL");
        // const order=await triterras.OrderDetails(BL);
        // console.log(order,"order Details");         
    })
    //Buyer to Trader
    it("verifying BL Buyer to Trader", async () => {
        const BL = 3;
        await triterras.connect(trader).updateBL(BL, "BuyerToTrader UpdateBL");
        // const order=await triterras.OrderDetails(BL);
        // console.log(order,"order Details");
    })
    //***************************************verify BL Failing***************************************
    //seller to Trader
    it("Verify BL Seller to Trader with Wrong Trade Number", async () => {
        try {
            const tradeNumber = 2;
            await triterras.connect(trader).verifyBL(tradeNumber);

        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }

    })

    it("Verify BL Seller to Trader with Trade Number That doesnot exist", async () => {
        try {
            const tradeNumber = 103;
            await triterras.connect(trader).verifyBL(tradeNumber);

        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidTradeNumber()'");
        }

    })

    it("Verify BL Seller to Trader with seller Address", async () => {
        try {
            const tradeNumber = 1;
            await triterras.connect(seller).verifyBL(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })

    //Trader to Buyer
    it("Verify BL Trader to Buyer with Wrong Trade Number", async () => {
        try {
            const tradeNumber = 1;
            await triterras.connect(buyer).verifyBL(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })

    it("Verify BL Trader to Buyer with Trade Number That doesnot exist", async () => {
        try {
            const tradeNumber = 101;
            await triterras.connect(buyer).verifyBL(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidTradeNumber()'");
        }
    })

    it("Verify BL Trader to Buyer with trader Address", async () => {
        try {
            const tradeNumber = 2;
            await triterras.connect(trader).verifyBL(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })
    //BuyertoTrader
    it("Verify BL Buyer TO Trader with wrong trade Number", async () => {
        try {
            const tradeNumber = 1;
            await triterras.connect(buyer).verifyBL(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })
    it("Verify BL Buyer TO Trader with Trade Number That doesnot exist", async () => {
        try {
            const tradeNumber = 101;
            await triterras.connect(buyer).verifyBL(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidTradeNumber()'");
        }
    })
    it("Verify BL buyer to Trader with trader Address", async () => {
        try {
            const tradeNumber = 3;
            await triterras.connect(trader).verifyBL(tradeNumber);
        } catch (error) {
            expect(error.message).to.equal
                ("VM Exception while processing transaction: reverted with custom error 'InvalidCallerAddress()'");
        }
    })

    //***************************************verify BL***************************************
    //seller to Trader
    it("Verify BL Seller to Trader", async () => {
        const tradeNumber = 1;
        await triterras.connect(trader).verifyBL(tradeNumber);
        // const order=await triterras.OrderDetails(1);
        // console.log(order,"order Details");
    })
    //Trader to Buyer
    it("Verify BL Trader to Buyer", async () => {
        const tradeNumber = 2;
        await triterras.connect(buyer).verifyBL(tradeNumber);
        // const order=await triterras.OrderDetails(2);
        // console.log(order,"order Details");
    })
    //Buyer To Trader
    it("Verify BL Buyer to Trader", async () => {
        const tradeNumber = 3;
        await triterras.connect(buyer).verifyBL(tradeNumber);
        // const order=await triterras.OrderDetails(3);
        // console.log(order,"order Details");
    })


    //***************************************getBLHash Failing ***************************************

    it("getBlHash of tradenumber that doesnot exist", async () => {
        try {
            const tradeNumber = 110;
            const hash = await triterras.getBlHash(tradeNumber);
        } catch (error) {

        }

    })
    //***************************************getBlHash ***************************************

    //seller to trader hash
    it("getBlHash", async () => {
        const tradeNumber = 1;
        const hash = await triterras.getBlHash(tradeNumber);
        // console.log(hash,"hash");
    })

    //***************************************Detail about Order***************************************
    it("getting Details of All", async () => {
        const order = await triterras.batchDetailsTrades([1, 2, 3]);
        // console.log(order,"order Details");
    })
    //***************************************Detail about allTradingNumbers***************************************

    //allTradingNumbers()
    it("getting Details of All TradeNumber", async () => {
        const order = await triterras.allTradingNumbers();
        console.log(order, "order Details");
    })






})