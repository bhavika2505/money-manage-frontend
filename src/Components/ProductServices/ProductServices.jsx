import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBook, faChartLine } from '@fortawesome/free-solid-svg-icons';
import './ProductServices.css'
import ServiceDetailDialog from './ServiceDetailsDialog';
import ServiceForm from '../ServiceForm/ServiceForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


function ProductServices() {
  const [services, setServices] = useState([]);
  const [hasServices, setHasServices] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedSAC, setSelectedSAC] = useState('');
const [isTaxIncluded, setIsTaxIncluded] = useState(false);
  
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


  useEffect(() => {

    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8084/getServices'); // Adjust the endpoint as needed
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter(service => {
      const serviceNameMatch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      const priceMatch = Number(service.servicePrice) >= minPrice && Number(service.servicePrice) <= maxPrice;
      const unitMatch = selectedUnit ? service.serviceUnit === selectedUnit : true;
      return serviceNameMatch && priceMatch && unitMatch;
    });
    setFilteredServices(filtered);
  }, [services, searchTerm, minPrice, maxPrice, selectedUnit]);

  const addService = () => {
    setShowServiceForm(true);
    setShowServiceDetails(false); // Ensure the details dialog is closed when adding a service
  };

  const handleUpdateService = (updatedService) => {
    // Update the services in state with the updated service data
    setServices(services.map((service) => 
      service._id === updatedService._id ? updatedService : service
    ));
    // Close the service details dialog or perform other actions as needed
    setShowServiceDetails(false);
  };

   const handleServiceClick = (service) => {
    setSelectedService(service); // Set the clicked service data
    setShowServiceDetails(true); // Show the service details dialog
    setShowServiceForm(false); // Ensure the add service form is closed
  };

  
  const handleCloseServiceDetails = () => {
    setShowServiceDetails(false); // Hide the service details dialog
    setSelectedService(null); // Clear the selected service
  };

  const handleClose = () => {
    setShowServiceForm(false); // Hide the modal
  };

  const handleServiceAdded = (newService) => {
    // Update your services state to include the new service
    setServices((prevServices) => [...prevServices, newService]);

    // If you want to update the filteredServices as well:
    setFilteredServices((prevFilteredServices) => [...prevFilteredServices, newService]);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMinPrice(0);
    setMaxPrice(Infinity);
    setSelectedUnit('');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Service Name", "Price", "Unit"]; // Add other columns as needed
    const tableRows = [];
  
    const dataToDownload = filteredServices.length ? filteredServices : services;
  
    dataToDownload.forEach(service => {
      const serviceData = [
        service.serviceName,
        service.servicePrice,
        service.serviceUnit,
        // ...other data fields
      ];
      tableRows.push(serviceData);
    });
  
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Filtered Services", 14, 15);
    doc.save("services.pdf");
  };
  
  const downloadExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
  
    const dataToDownload = filteredServices.length ? filteredServices : services;
    const ws = XLSX.utils.json_to_sheet(dataToDownload);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    
    FileSaver.saveAs(data, "services" + fileExtension);
  };

  const getTotalServices = () => {
    return services.length;
  };

  // Function to calculate total services cost
  const getTotalServicesCost = () => {
    return services.reduce((acc, service) => acc + Number(service.servicePrice), 0);
  };

  // Function to calculate total number of tax included services
  const getTotalTaxIncludedServices = () => {
    return services.filter(service => service.isTaxIncluded).length;
  };

  // Function to calculate total tax not included services
  const getTotalTaxNotIncludedServices = () => {
    return services.filter(service => !service.isTaxIncluded).length;
  };

  if (hasServices) {
    return null;
  }

  return (
    
    <div className="services-container">
         <div className="dashboard-prod">
      <div className='uper-dash'>
        <div className="dashboard-item">
          <span>Total Services</span>
          <span>{getTotalServices()}</span>
        </div>
        <div className="dashboard-item">
          <span>Total Services Cost</span>
          <span>₹{getTotalServicesCost().toFixed(2)}</span>
        </div>
      </div>
      <div className='uper-dash'>
        <div className="dashboard-item">
          <span>With Tax Services</span>
          <span>{getTotalTaxIncludedServices()}</span>
        </div>
        <div className="dashboard-item">
          <span>Without Tax Services</span>
          <span>{getTotalTaxNotIncludedServices()}</span>
        </div>
      </div>
    </div>
       
         <div className="filter-container">
         <input
           type="text"
           placeholder="Search services by name..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="service-search-bar"
         />
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            placeholder="Min Price"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            placeholder="Max Price"
          />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="unit-dropdown"
            >
              <option value="">Filter by Unit</option>
              {unitsList.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <button onClick={resetFilters} className="remove-filters-btn">
              Remove Filters
            </button>
      </div>
      <div className='download-btn'>
        <button onClick={downloadPDF} className="download-pdf-btn">
          Download PDF
        </button>
        <button onClick={downloadExcel} className="download-excel-btn">
          Download Excel
        </button>
      </div>
      
      {services.length === 0 ? (

        <div className="illustration-container">
          {/* Place your illustration here */}
          <h1>Add Services and Get Started</h1>
          <ul className="services-list">
            <li><FontAwesomeIcon icon={faBox} /> Manage services and prices</li>
            <li><FontAwesomeIcon icon={faBook} /> Save SAC and GST details</li>
            <li><FontAwesomeIcon icon={faChartLine} /> Track sales and create bills</li>
          </ul>
        </div>
      ) : (
        // Map through services and display them
        <div className="services-list">
          {filteredServices.map(service => (
            <div className="service-item" key={service._id} onClick={() => handleServiceClick(service)}>
              <img className='serviesimg' src={service.productImage} alt={service.serviceName} />
              <div className="service-details">
                <h2>{service.serviceName}</h2>
                <p>Service Price: ₹ {service.servicePrice} / {service.serviceUnit}</p>
                {/* Include other details you want to display */}
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="add-service-btn" onClick={addService}>
        ADD SERVICE
      </button>
      {showServiceForm && (
        <div className="product-form-modal">
         <ServiceForm
          onClose={handleClose}
          onServiceAdded={handleServiceAdded} 
          />

          <button className="close-modal-btn" onClick={handleClose}>Close</button>
        </div>
      )}
       {showServiceDetails && selectedService && (
     
        <ServiceDetailDialog
          service={selectedService}
          onClose={handleCloseServiceDetails}
          onSave={handleUpdateService} // Ensure this is a function
        />
    )}
    </div>
  );
}

export default ProductServices;
