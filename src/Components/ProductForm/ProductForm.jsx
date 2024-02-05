import React, { useState } from 'react';
import './ProductForm.css';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';

function ProductForm( {onClose,  updateProduct} ) {
  const [showHSNGST, setShowHSNGST] = useState(false);

  const unitsList = [
    "Dozens - DOZ",
    "Drums - DRM",
    "Grammes - GMS",
    "Great Gross - GGK",
    "Gross - GRS",
    "Gross Yards - GYD",
    "Kilolitre - KLR",
    "Kilometre - KME",
    "Litre - LTR",
    "Meters - MTR",
    "Metric Ton - MT",
    "Mililitre - MLT",
    "Packs - PAC",
    "Pairs - PRS",
    "Quintal - QTL",
    "Rolls - ROL",
    "Sets - SET",
    "Square Feet - SQF",
    "Square Yards - SQM",
    "Tablets - TBS",
    "Ten Gross - TGM",
    "Thousands - THD",
    "Tonnes - TON",
    "Tubes - TUB",
    "Units - UNT",
    "US gallons - UGS",
    "Yards - YDS",
    // ... continue with all other units
  ];

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      resizeImage(e.target.files[0], 800, 600, (resizedBlob) => {
        // Convert blob to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, productImage: reader.result });
        };
        reader.readAsDataURL(resizedBlob);
      });
    }
  };
  
  
  const [formData, setFormData] = useState({
    itemName: '',
    primaryUnit: '',
    secondaryUnit: '',
    conversionRate: '',
    salePrice: '',
    purchasePrice: '',
    taxIncluded: false,
    openingStock: '',
    lowStockAlert: '',
    asOfDate: new Date().toISOString().split('T')[0], // Pre-fill with today's date
    hsnCode: '', // Initialize HSN Code
    gstRate: '', // Initialize GST Rate
    useSecondary: false,
    filteredUnits: unitsList,
  });

  const toggleHSNGSTFields = () => {
    setShowHSNGST(!showHSNGST);
  };

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const customUnitsOptions = unitsList.map(unit => ({
    value: unit,
    label: unit
  }));

  const handleSecondaryUnitChange = (selectedOption) => {
    setFormData({ ...formData, secondaryUnit: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert the formData state to a format suitable for sending
    // It might need adjustment based on your actual state structure
    const dataToSend = {
      itemName: formData.itemName,
      primaryUnit: formData.primaryUnit,
      secondaryUnit: formData.secondaryUnit,
      conversionRate: formData.conversionRate,
      salePrice: formData.salePrice,
      purchasePrice: formData.purchasePrice,
      taxIncluded: formData.taxIncluded,
      openingStock: formData.openingStock,
      lowStockAlert: formData.lowStockAlert,
      asOfDate: formData.asOfDate,
      hsnCode: formData.hsnCode,
      gstRate: formData.gstRate,
      useSecondary: formData.useSecondary,
      productImage: formData.productImage, // Assuming this is already a Base64 string
    };
  
    try {
      const response = await fetch('https://banking-app-backend-se4u.onrender.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Success:', result);
      onClose();
      updateProduct();
      // Handle success response, maybe clear form or show a success message
    } catch (error) {
      console.error('Error:', error);
      // Handle errors here, such as showing an error message to the user
    }
  };
  
  const handleToggleSecondaryUnit = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      useSecondary: !prevFormData.useSecondary
    }));
  };

  const handleUnitSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFormData(prevFormData => ({
      ...prevFormData,
      filteredUnits: unitsList.filter(unit =>
        unit.toLowerCase().includes(searchTerm)
      )
    }));
  };

  function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        let width = img.width;
        let height = img.height;
  
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
  
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
  
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
  
        canvas.toBlob(callback, 'image/jpeg', 0.7); // Adjust quality as needed
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className='product-header'>
    <h1>Products</h1>
    </div>
      <label>
        Enter Item Name*
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="e.g., Chairs, Chips, Bulbs"
          required
        />
      </label>
      <label>
        Product Image
        <input
          type="file"
          name="productImage"
          onChange={handleImageChange}
          accept="image/*" // Accept only image files
        />
      </label>

      {formData.productImage && (
        <img
          src={formData.productImage}
          alt="Uploaded Product"
          style={{ width: '100px', height: 'auto' }} // Adjust the size as needed
        />
      )}

      <label>
        Primary Unit
        <Select
          options={customUnitsOptions}
          onChange={selectedOption => setFormData({ ...formData, primaryUnit: selectedOption.value })}
        />
      </label>
      <label className='sec-unit'>
        Add Secondary unit?
        <input
          type="checkbox"
          name="useSecondary"
          checked={formData.useSecondary}
          onChange={handleToggleSecondaryUnit}
        />
      </label>

      {formData.useSecondary && (
        <React.Fragment>
          <label>
            Secondary Unit
            <Select
              options={customUnitsOptions}
              onChange={handleSecondaryUnitChange}
            />
          </label>
          <label>
            Conversion
            <input
              type="text"
              name="conversionRate"
              value={formData.conversionRate}
              onChange={handleChange}
              placeholder="e.g., 2"
              required={formData.useSecondary} // Make this field required if secondary unit is used
            />
          </label>
        </React.Fragment>
      )}

{/* <div className="unit-search-container">
  <input
    type="text"
    placeholder="Search Units"
    onChange={handleUnitSearch}
  />
</div> */}

      <label>
        Sale Price
        <input
          type="text"
          name="salePrice"
          value={formData.salePrice}
          onChange={handleChange}
          placeholder="Enter price"
        />
      </label>

      <label>
        Purchase Price
        <input
          type="text"
          name="purchasePrice"
          value={formData.purchasePrice}
          onChange={handleChange}
          placeholder="Enter price"
        />
      </label>

      <label>
        Tax Included
        <input
          type="checkbox"
          name="taxIncluded"
          checked={formData.taxIncluded}
          onChange={handleChange}
        />
      </label>

      <label>
        Opening Stock
        <input
          type="text"
          name="openingStock"
          value={formData.openingStock}
          onChange={handleChange}
          placeholder="Enter count"
        />
      </label>

      <label>
        Low Stock Alert
        <input
          type="text"
          name="lowStockAlert"
          value={formData.lowStockAlert}
          onChange={handleChange}
          placeholder="Enter count"
        />
      </label>

      <label>
        As of Date
        <input
          type="date"
          name="asOfDate"
          value={formData.asOfDate}
          onChange={handleChange}
          placeholder="Today"
        />
      </label>


      <button type="button" onClick={toggleHSNGSTFields}>
        Add HSN and GST details
      </button>

      {showHSNGST && (
        <React.Fragment>
          <label>
            HSN Code
            <input
              type="text"
              name="hsnCode"
              value={formData.hsnCode || ''} // Ensure you have hsnCode in your formData state
              onChange={handleChange}
              placeholder="Enter HSN Code"
            />
          </label>
          <label>
            GST %
            <input
              type="number"
              name="gstRate"
              value={formData.gstRate || ''} // Ensure you have gstRate in your formData state
              onChange={handleChange}
              placeholder="Enter GST Percentage"
              step="0.01" // Allows decimal values
            />
          </label>
        </React.Fragment>
      )}
      <button type="submit">Save Item</button>
    </form>
    
  );
}

export default ProductForm;
