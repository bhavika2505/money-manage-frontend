// import React from 'react';
// import './ServiceDetailDialog.css'; 


// function ServiceDetailDialog({ service, onClose, onSave }) {
//   const [editMode, setEditMode] = useState(false);
//   const [editedService, setEditedService] = useState({ ...service });

//   const handleEditToggle = () => {
//     setEditMode(!editMode);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditedService(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     // Call your backend API to update the service details
//     try {
//       const response = await fetch(`http://localhost:8084/updateService/${editedService._id}`, {
//         method: 'PUT', // or 'PATCH' depending on your backend
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(editedService),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       onSave(result); // Pass the updated service back to the parent component
//       setEditMode(false); // Exit edit mode
//     } catch (error) {
//       console.error('Error:', error);
//       // Handle errors here, such as showing an error message to the user
//     }
//   };

//   if (!service) {
//     return null;
//   }

//   return (
//     <div className="service-detail-overlay">
//       <div className="service-detail-dialog">
//         <div className="service-detail-header">
//           <h2>{service.serviceName}</h2>
//           <button className="edit-service-button">EDIT SERVICE</button>
//         </div>
//         <div className="service-detail-body">
//           <div className="service-detail-row">
//             <div className="service-detail-label">Item Name</div>
//             <div className="service-detail-value">{service.serviceName}</div>
//           </div>
//           <div className="service-detail-row">
//             <div className="service-detail-label">Sale Price</div>
//             <div className="service-detail-value">₹ {service.servicePrice} / {service.serviceUnit}</div>
//           </div>
//           <div className="service-detail-row">
//             <div className="service-detail-label">SAC Code</div>
//             <div className="service-detail-value">{service.sacCode || '-'}</div>
//           </div>
//           <div className="service-detail-row">
//             <div className="service-detail-label">GST %</div>
//             <div className="service-detail-value">{service.gstPercentage || '-'}</div>
//           </div>
//           <div className="service-detail-sales-info">
//             No sales added for this service
//           </div>
//         </div>

        
//         <button className="close-service-detail-button" onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// }

// export default ServiceDetailDialog;

import React, { useState } from 'react'; // Import useState
import './ServiceDetailDialog.css';

function ServiceDetailDialog({ service, onClose, onSave }) {
  const [editMode, setEditMode] = useState(false);
  const [editedService, setEditedService] = useState({ ...service });

  const handleEditToggle = () => {
    setEditMode(true); // Enable edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedService(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Call your backend API to update the service details
    try {
      const response = await fetch(`http://localhost:8084/updateService/${editedService._id}`, {
        method: 'PUT', // or 'PATCH' depending on your backend
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedService),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      onSave(result); // Pass the updated service back to the parent component
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!service) {
    return null;
  }

  return (
    <>
    <div className="service-detail-overlay">
      <div className="service-detail-dialog">
        <div className="service-detail-header">
          {editMode ? (
            <input
              type="text"
              value={editedService.serviceName}
              name="serviceName"
              onChange={handleInputChange}
            />
          ) : (
            <h2>{service.serviceName}</h2>
          )}

          {editMode ? (
            <button className="save-service-button" onClick={handleSave}>SAVE</button>
          ) : (
            <button className="edit-service-button" onClick={handleEditToggle}>EDIT SERVICE</button>
          )}
        </div>

        <div className="service-detail-body">
          <div className="service-detail-row">
            <div className="service-detail-label">Item Name</div>
            <div className="service-detail-value">
              {editMode ? (
                <input
                  type="text"
                  value={editedService.serviceName}
                  name="serviceName"
                  onChange={handleInputChange}
                />
              ) : (
                service.serviceName
              )}
            </div>
          </div>

          <div className="service-detail-body">
  <div className="service-detail-row">
    <div className="service-detail-label">Item Name</div>
    <div className="service-detail-value">
      {editMode ? (
        <input
          type="text"
          value={editedService.serviceName}
          name="serviceName"
          onChange={handleInputChange}
        />
      ) : (
        service.serviceName
      )}
    </div>
  </div>

  <div className="service-detail-row">
    <div className="service-detail-label">Sale Price</div>
    <div className="service-detail-value">
      {editMode ? (
        <input
          type="text"
          value={editedService.servicePrice}
          name="servicePrice"
          onChange={handleInputChange}
        />
      ) : (
        `₹ ${service.servicePrice} / ${service.serviceUnit}`
      )}
    </div>
  </div>

  <div className="service-detail-row">
    <div className="service-detail-label">SAC Code</div>
    <div className="service-detail-value">
      {editMode ? (
        <input
          type="text"
          value={editedService.sacCode || ''}
          name="sacCode"
          onChange={handleInputChange}
        />
      ) : (
        service.sacCode || '-'
      )}
    </div>
  </div>

  <div className="service-detail-row">
    <div className="service-detail-label">GST %</div>
    <div className="service-detail-value">
      {editMode ? (
        <input
          type="text"
          value={editedService.gstPercentage || ''}
          name="gstPercentage"
          onChange={handleInputChange}
        />
      ) : (
        service.gstPercentage || '-'
      )}
    </div>
  </div>

          {/* ... Other service detail rows ... */}
          {/* Make sure to add editable input fields for each detail as done above */}

        </div>

        <button className="close-service-detail-button" onClick={onClose}>Close</button>
      </div>
    </div>
    </div>
    </>
  );
}

export default ServiceDetailDialog;
