import React, { useState } from 'react';
import './ServiceForm.css';

function ServiceForm({onClose,  onServiceAdded}) {

  const [showSACAndGST, setShowSACAndGST] = useState(false);

  const initialFormData = {
    serviceName: '',
    servicePrice: '',
    serviceUnit: '',
    isTaxIncluded: false,
    productImage: null,
    sacCode: null, 
    gstPercentage: null
  };
  
  const [formData, setFormData] = useState(initialFormData);



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


  const submitServiceData = async (formData) => {
    try {
        const response = await fetch('http://localhost:8084/addService', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Service added successfully:', data);
        onServiceAdded(data);
        onClose();
        setFormData(initialFormData);
        // Handle success (e.g., show a success message or redirect)
    } catch (error) {
        console.error('Error adding service:', error);
        // Handle errors (e.g., show error message)
    }
};


const handleServiceSubmit = async (e) => {
  e.preventDefault();
  await submitServiceData(formData);

};


const handleImageChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    resizeImage(e.target.files[0], (resizedBlob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, productImage: reader.result });
      };
      reader.readAsDataURL(resizedBlob);
    });
  }
};


  function resizeImage(file, callback) {
    const maxWidth = 100; // Max width for the image
    const maxHeight = 100; // Max height for the image
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
  
        // Calculate the width and height, maintaining the aspect ratio
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
        canvas.width = width;
        canvas.height = height;
  
        // Draw the resized image
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(callback, 'image/jpeg', 0.7); // Adjust quality as needed
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  const toggleSACAndGSTFields = () => {
    setShowSACAndGST(prevState => !prevState);
  };

  return (
    <form className="service-form" onSubmit={handleServiceSubmit}>
      <h2>Add Services</h2>

      <label htmlFor="service-name">Enter Service Name Here*</label>
      <input
        id="service-name"
        type="text"
        value={formData.serviceName}
        onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
        placeholder="Eg Carpentry, Consulting, ..."
        required
      />

<div className="price-unit-flex"> {/* Flex container */}
        <div>
          <label htmlFor="service-price">Service Price</label>
          <input
            id="service-price"
            type="number"
            value={formData.servicePrice}
            onChange={(e) => setFormData({ ...formData, servicePrice: e.target.value })}
            placeholder="Enter price"
          />
        </div>

        <div>
          <label htmlFor="service-unit">Unit</label>
          <select
            id="service-unit"
            value={formData.serviceUnit}
            onChange={(e) => setFormData({ ...formData, serviceUnit: e.target.value })}
          >
            <option value="">Select Unit</option>
            {unitsList.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="toggle-switch">
        <label htmlFor="tax-included">Tax Included in Price</label>
        <input
          id="tax-included"
          type="checkbox"
          checked={formData.isTaxIncluded}
          onChange={(e) => setFormData({ ...formData, isTaxIncluded: e.target.checked })}
        />
      </div>

      <button type="button" onClick={toggleSACAndGSTFields}>
        {showSACAndGST ? '- Remove SAC Code & GST %' : '+ Add SAC Code & GST %'}
      </button>

      {showSACAndGST && (
        <>
          <label htmlFor="sac-code">Enter SAC Code</label>
          <input
            id="sac-code"
            type="text"
            value={formData.sacCode || ''}
            onChange={(e) => setFormData({ ...formData, sacCode: e.target.value })}
            placeholder="Enter SAC Code"
          />

          <label htmlFor="gst-percentage">GST Percentage</label>
          <input
            id="gst-percentage"
            type="number"
            value={formData.gstPercentage || ''}
            onChange={(e) => setFormData({ ...formData, gstPercentage: parseFloat(e.target.value) })}
            placeholder="Enter GST Percentage"
          />
        </>
      )}

      <label htmlFor="service-image">Upload Service Image</label>
      <input
        id="service-image"
        type="file"
        onChange={handleImageChange}
        accept="image/*"
      />

      {formData.productImage && (
        <div className="image-preview">
          <img src={formData.productImage} alt="Service Preview" />
        </div>
      )}

      <button type="submit">Add Service</button>
    </form>
  );
}

export default ServiceForm;
