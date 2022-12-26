const express = require("express");
const router = express.Router();

//Model Imports
const Product = require("../models/productModel");

const auth = require("../middleware/auth");
const uploadFile = require("../file/uploadFile");

// route to add product by productowner
router.post(
  "/product/add",
  auth.userGuard,
  uploadFile.single("product_img"),
  (req, res) => {
    if (req.file == undefined) {
      return res.status(401).json({
        msg: "Invalid file formate",
      });
    }

    const product_pic = req.file.filename;
    const name = req.body.name;
    const rich_desc = req.body.rich_desc;
    const desc = req.body.desc;
    const author = req.body.author;
    const category = req.body.category.split(",");
    const productOwner = req.userInfo._id;

    const data = new Product({
      product_pic: product_pic,
      name: name,
      rich_desc: rich_desc,
      desc: desc,
      author: author,
      category: category,
      productOwner: productOwner,
    });
    data
      .save()
      .then(() => {
        res.status(201).json({
          success: true,
          msg: "Product uploaded Successfully",
        });
      })
      .catch((e) => {
        res.json({
          msg: e,
        });
      });
  }
);

// route to get products by productowner
router.get("/product/getbyOwner", auth.userGuard, (req, res) => {
  Product.find({ productOwner: req.userInfo._id })
    .sort({
      createdAt: "desc",
    })
    .then((product) => {
      res.status(201).json({
        success: true,
        data: product,
      });
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

// route to get product by all user
router.get("/product/get", (req, res) => {
  Product.find({ $and: [{ status: "Approved" }, { is_available: true }] })
    .then((product) => {
      if (product != null) {
        res.status(200).json({
          success: true,
          data: product,
        });
      }
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

// route to get one product by all user
router.get("/product/getone/:id", (req, res) => {
  Product.findOne({
    _id: req.params.id,
  })
    .then((product) => {
      if (product != null) {
        res.status(200).json({
          success: true,
          data: product,
        });
      }
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

// route to get all requested products by admin
router.get("/product/getallbyadmin", auth.adminGuard, (req, res) => {
  Product.find()
    .populate("productOwner")
    .sort({
      createdAt: "desc",
    })
    .then((product) => {
      if (product != null) {
        res.status(200).json({
          success: true,
          data: product,
        });
      }
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

// router to approve product
router.put("/product/approve", auth.adminGuard, (req, res) => {
  Product.updateOne(
    {
      _id: req.body.id,
    },
    {
      status: "Approved",
    }
  )
    .then(() => {
      res.status(201).json({
        msg: "Approved successful",
      });
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});
// router to reject product
router.put("/product/reject", auth.adminGuard, (req, res) => {
  Product.updateOne(
    {
      _id: req.body.id,
    },
    {
      status: "Rejected",
    }
  )
    .then(() => {
      res.status(201).json({
        msg: "Rejected successful",
      });
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

//Router To Update product
router.put(
  "/product/update",
  auth.userGuard,
  uploadFile.single("product_img"),
  (req, res) => {
    const name = req.body.name;
    const rich_desc = req.body.rich_desc;
    const desc = req.body.desc;
    const author = req.body.author;
    const category = req.body.category.split(",");
    const id = req.body._id;
    console.log(name);
    if (req.file == undefined) {
      Product.updateOne(
        { _id: id },
        {
          name: name,
          rich_desc: rich_desc,
          desc: desc,
          author: author,
          category: category,
        }
      )
        .then(() => {
          res
            .status(201)
            .json({ msg: "Product Updated Successfully", success: true });
        })
        .catch((e) => {
          res.status(400).json({ msg: e });
        });
    } else {
      Product.updateOne(
        { _id: id },
        {
          name: name,
          rich_desc: rich_desc,
          desc: desc,
          author: author,
          category: category,
          product_pic: req.file.filename,
        }
      )
        .then(() => {
          res
            .status(201)
            .json({ msg: "Product Updated Successfully", success: true });
        })
        .catch((e) => {
          res
            .status(400)
            .json({ msg: "Something Went Wrong, Please Try Again!!!" });
        });
    }
  }
);

//Router To Delete product
router.delete("/product/delete/:productId", auth.userGuard, (req, res) => {
  console.log(req.params.productId);
  Product.deleteOne({ _id: req.params.productId })
    .then(() => {
      res
        .status(201)
        .json({ msg: "Product Deleted Successfully", success: true });
    })
    .catch((e) => {
      res
        .status(400)
        .json({ msg: "Something Went Wrong, Please Try Again!!!" });
    });
});

router.put("/product/isAvailable", auth.userGuard, (req, res) => {
  Product.updateOne(
    {
      _id: req.body.id,
    },
    {
      is_available: true,
    }
  )
    .then(() => {
      res.status(201).json({
        msg: "product is available",
      });
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

router.put("/product/isNotAvailable", auth.userGuard, (req, res) => {
  Product.updateOne(
    {
      _id: req.body.id,
    },
    {
      is_available: false,
    }
  )
    .then(() => {
      res.status(201).json({
        msg: "Product is not available",
      });
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

// get product by author (recommedation product)
router.get("/product/getauthor/:author", (req, res) => {
  Product.find({
    author: req.params.author,
  })
    .then((product) => {
      if (product != null) {
        res.status(200).json({
          success: true,
          data: product,
        });
      }
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

module.exports = router;
