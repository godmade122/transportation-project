const Price = require("../models/Price");


// GET ALL PRICES
const getPrices = async (req, res) => {
  try {

    const prices = await Price.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      prices
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get prices"
    });

  }
};


// CREATE PRICE
const createPrice = async (req, res) => {
  try {

    const { rideType, amount } = req.body;

    if (!rideType || amount === undefined) {

      return res.status(400).json({
        success: false,
        message: "Ride type and amount are required"
      });

    }


    const existingPrice = await Price.findOne({
      rideType
    });


    if (existingPrice) {

      return res.status(400).json({
        success: false,
        message: "Price already exists for this ride type"
      });

    }


    const price = await Price.create({

      rideType,
      amount,

      updatedBy: req.user.id

    });


    res.status(201).json({
      success: true,
      message: "Price created successfully",
      price
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create price"
    });

  }
};


// UPDATE PRICE
const updatePrice = async (req, res) => {
  try {

    const { id } = req.params;

    const { amount } = req.body;


    if (amount === undefined) {

      return res.status(400).json({
        success: false,
        message: "Amount is required"
      });

    }


    const price = await Price.findByIdAndUpdate(

      id,

      {
        amount,
        updatedBy: req.user.id
      },

      {
        new: true,
        runValidators: true
      }

    );


    if (!price) {

      return res.status(404).json({
        success: false,
        message: "Price not found"
      });

    }


    res.status(200).json({
      success: true,
      message: "Price updated successfully",
      price
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update price"
    });

  }
};


// DELETE PRICE
const deletePrice = async (req, res) => {

  try {

    const { id } = req.params;


    const price = await Price.findByIdAndDelete(id);


    if (!price) {

      return res.status(404).json({
        success: false,
        message: "Price not found"
      });

    }


    res.status(200).json({

      success: true,

      message: "Price deleted successfully"

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Failed to delete price"

    });

  }

};


module.exports = {

  getPrices,

  createPrice,

  updatePrice,

  deletePrice

};