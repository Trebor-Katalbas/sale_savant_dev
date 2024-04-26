import Supplier from "../models/Supplier.js";
import SupplyDelivery from "../models/SupplyDelivery.js";

// Add
export const AddSupplier = async (req, res) => {
  try {
    const { supplierName, contactPerson, contactNo, email, category } =
      req.body;

    const newSupplier = new Supplier({
      supplierName,
      contactPerson,
      contactNo,
      email,
      category,
    });

    const savedSupplier = await newSupplier.save();

    res.status(201).json(savedSupplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const AddSupplyDelivery = async (req, res) => {
  try {
    const {
      supplierName,
      deliveryDate,
      itemName,
      quantity,
      quantityUnit,
      deliveryStatus,
      totalPaid,
      totalCost,
    } = req.body;

    const supplier = await Supplier.findOne({ supplierName });
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    const newSupplyDelivery = new SupplyDelivery({
      supplier: {
        supplierId: supplier._id,
        supplierName: supplier.supplierName,
        contactPerson: supplier.contactPerson,
        contactNo: supplier.contactNo,
        category: supplier.category,
      },
      deliveryDate,
      itemName,
      quantity,
      quantityUnit,
      deliveryStatus,
      totalPaid,
      totalCost,
    });

    const savedSupplyDelivery = await newSupplyDelivery.save();

    res.status(201).json(savedSupplyDelivery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get
export const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.find();
    res.status(200).json(supplier);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getSupplyRecord = async (req, res) => {
  try {
    const supplyRecord = await SupplyDelivery.find();
    res.status(200).json(supplyRecord);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getSupplierId = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplierName, contactPerson, contactNo, email, category } =
      req.body;

    const existingSupplier = await Supplier.findById(id);

    if (!existingSupplier) {
      return res.status(404).json({ error: "supplier not found" });
    }

    existingSupplier.supplierName = supplierName;
    existingSupplier.contactPerson = contactPerson;
    existingSupplier.contactNo = contactNo;
    existingSupplier.email = email;
    existingSupplier.category = category;

    const updatedSupplier = await existingSupplier.save();

    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateTotalPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalPaid, deliveryStatus } = req.body;

    const existingSupplyRecord = await SupplyDelivery.findById(id);

    if (!existingSupplyRecord) {
      return res.status(404).json({ error: "supply record not found" });
    }

    existingSupplyRecord.totalPaid = totalPaid;
    existingSupplyRecord.deliveryStatus = deliveryStatus;

    const updateTotalPaid = await existingSupplyRecord.save();

    res.status(200).json(updateTotalPaid);
  } catch (error) {
    console.error("Error updating supply record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    await Supplier.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: `Supplier ${supplier._id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteSupplyRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const supplyRecord = await SupplyDelivery.findById(id);

    if (!supplyRecord) {
      return res.status(404).json({ error: "Supply Record not found" });
    }

    await SupplyDelivery.findByIdAndDelete(id);

    res
      .status(200)
      .json({
        message: `Supply Record ${supplyRecord._id} deleted successfully`,
      });
  } catch (error) {
    console.error("Error deleting supply record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
