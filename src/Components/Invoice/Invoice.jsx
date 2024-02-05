import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import './Invoice.css'
import './Preview.css'
import ReactToPrint from 'react-to-print';
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineDiscount } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoIosMail } from "react-icons/io";
import { toWords } from 'number-to-words';
import { MdCancel } from "react-icons/md";
import Modal from '../Modal/Modal';
import { TbDiscount } from "react-icons/tb";
import { MdFileDownloadDone } from "react-icons/md";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { TbReportMoney } from "react-icons/tb";
import { IoAdd } from "react-icons/io5";
import { MdInsertPhoto } from "react-icons/md";
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';
import SideNavbar from '../Dashboard/SideNavbar/SideNavbar';
import html2canvas from "html2canvas";
import axios from 'axios';

const PrintInvoice = React.forwardRef(({ invoiceData, shippingDetails }, ref) => {
  const {
    invoiceNo, invoiceDate, dueDate, logo, billedBy, billedTo, items, total, termsConditions,
     discountsAdditionalCharges, notes, isRecurring, repeatInterval, nextRepeatDate
  } = invoiceData;
  const isEmpty = (detail) => Object.values(detail).every(x => x === null || x === '');
  const shouldShowShippingDetails = !isEmpty(shippingDetails.shippedFrom) ||
                                    !isEmpty(shippingDetails.shippedTo) ||
                                    !isEmpty(shippingDetails.transportDetails); 

  return (
  <div id='invoice-preview' ref={ref} className="invoice-form">
    {/* Invoice Header */}
    <div className='previewhead'>
      <h2>Invoice</h2>
    </div>

    {/* Invoice Number, Date, and Due Date */}
    <div className='psection1'>
      <div>
        <p><strong>Invoice Number:</strong> #{invoiceNo}</p>
        <p><strong>Invoice Date:</strong> {invoiceDate}</p>
        <p><strong>Due Date:</strong> {dueDate}</p>
      </div>
      <div className='p-logo'>
        {logo && <img src={logo} alt="Business Logo" className="business-logo" />}
      </div>
    </div>

    {/* Billed By and Billed To Sections */}
    <div className='section2'>
      <div className='p-Billed-by'>
        <h2>Billed By</h2>
        <div>
        <p>Name: {billedBy.name}</p>
        <p>Address: {billedBy.address}, {billedBy.city}</p>
        {billedBy.phone && <p>Phone: {billedBy.phone}</p>}
        {billedBy.email && <p>Email: {billedBy.email}</p>}
        {billedBy.pan && <p>PAN: {billedBy.pan}</p>}
        </div>
      </div>

      <div className='billed-to'>
        <h2>Billed To</h2>
        <div>
          <p>Name: {billedTo.name}</p>
          <p>Address: {billedTo.address}, {billedTo.city}, {billedTo.state}</p>
          {billedTo.email && <p>Email: {billedTo.email}</p>}
          {billedTo.phone && <p>Phone: {billedTo.phone}</p>}
          {billedTo.gst && <p>GST: {billedTo.gst}</p>}
          {billedTo.pan && <p>PAN: {billedTo.pan}</p>}
        </div>
      </div>
    </div>

    {/* Shipping Details */}
    {shouldShowShippingDetails && (
      <div className='psection3'>
        <h2>Shipping Details</h2>
        <div className='pshipping-details'>
          {/* Shipping From Details */}
          <div>
            <h3>Shipped From</h3>
            <p>Name: {shippingDetails.shippedFrom.businessFreelancerName}</p>
            <p>Address: {`${shippingDetails.shippedFrom.address}, ${shippingDetails.shippedFrom.city}, ${shippingDetails.shippedFrom.postalCode}, ${shippingDetails.shippedFrom.state}`}</p>
          </div>

          {/* Shipping To Details */}
          <div>
            <h3>Shipped To</h3>
            <p>Name: {shippingDetails.shippedTo.clientBusinessName}</p>
            <p>Address: {`${shippingDetails.shippedTo.address}, ${shippingDetails.shippedTo.city}, ${shippingDetails.shippedTo.postalCode}, ${shippingDetails.shippedTo.state}`}</p>
          </div>

          {/* Transport Details */}
          <div>
            <h3>Transport Details</h3>
            <p>Mode of Transport: {shippingDetails.transportDetails.modeOfTransport}</p>
            <p>Transporter Name: {shippingDetails.transportDetails.transporterName}</p>
            <p>Distance (km): {shippingDetails.transportDetails.distanceKm}</p>
            {/* Include other transport details if necessary */}
          </div>
        </div>
      </div>
    )}

    {/* Items Details */}
    <div className='margin'></div>
    <div className='section4'>
      <h2>Items</h2>
      <div className='pitems'>
        {items && items.map((item, index) => (
          <div key={index} className="item">
            <p>Item Name: {item.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Rate: {item.rate}</p>
            <p>Amount: {item.amount}</p>
            <p>GST (%): {item.gstPercentage}</p>
            <p>GST Amount: {item.gstAmount.toFixed(2)}</p>
            <p>Item Description: {item.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Summary Section */}
    <div className='psection5'>
      {discountsAdditionalCharges && (
        <div className='pdiscount'>
          <p>Discount: {typeof discountsAdditionalCharges.discount === 'number' ? discountsAdditionalCharges.discount.toFixed(2) : '0.00'}</p>
          <p>Additional Charges: {discountsAdditionalCharges.additionalCharges}</p>
        </div>
      )}
      <div className='ptotal'>
        <h2>Total: </h2>
        <p>{total}</p>
      </div>
    </div>

    {termsConditions && (
      <div className='ptermsconditions'>
        <h2>Terms and Conditions</h2>
        <div className="pterms-display">
          {termsConditions.split('\n').map((term, index) => (
            <p key={index}>• {term}</p>
          ))}
        </div>
      </div>
    )}


    {isRecurring && (
      <div className="recurring-invoice-section">
        <h2>Recurring Invoice Details</h2>
        <p>Repeat Interval: {repeatInterval}</p>
        <p>Next Repeat Date: {nextRepeatDate}</p>
      </div>
    )}

    {/* ... other sections as needed ... */}
  </div>
 );
  });



const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: '',
    invoiceDate: '',
    dueDate: '',
    logo: '',
    billedBy: {
      name: '',
      address: '',
      city: '',
      phone: '',
      email: '',    
      pan: '',
    },
    billedTo: {
      name: '',
      address: '',
      email: '',
      phone: '',
      pan: '',
    },
    tax: 0,
    currency: 'INR',
    items: [
      { 
        name: '', 
        description: '', 
        quantity: 0, 
        rate: 0, 
        amount: 0, 
        gstPercentage: 0,
        gstAmount: 0,
      }
    ],
    discountsAdditionalCharges: {
      discount: 0,
      additionalCharges: 0,
    },
    totalQuantity: '',
    total: 0,
    termsConditions: '',
    notes: '',
    attachments: '',
    additionalInfo: '',
    contactDetails: '',
    isRecurringInvoice: false,
    advancedOptions: {
      hidePlaceOfSupply: false,
      addOriginalImages: false,
      showDescriptionFullWidth: false,
    }
  });
  const [totalInWords, setTotalInWords] = useState('');

  const printComponentRef = React.useRef();

  const [logoLabel, setLogoLabel] = useState("Add Business Logo");

  const handleLogoChange1 = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      setInvoiceData(prevState => ({
        ...prevState,
        logo: reader.result
      }));
      setLogoLabel(file ? file.name : "Add Business Logo"); // Update the label
    };
  
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setLogoLabel("Add Business Logo"); // Reset the label if no file is chosen
    }
  };

  // Event handler to convert total to words
  const handleShowTotalInWords = () => {
    event.preventDefault();
    const words = toWords(invoiceData.total);
    setTotalInWords(words);
  };

  const invoiceRef = React.createRef();

  // const handleLogoChange = (event) => {
  //   // Assuming you're storing the logo as a base64 string in the state
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  
  //   reader.onloadend = () => {
  //     setInvoiceData(prevState => ({
  //       ...prevState,
  //       logo: reader.result
  //     }));
  //   };
  
  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Set desired size
            const maxWidth = 150; // For example, 200 pixels wide
            const maxHeight = 100; // 200 pixels high

            // Create a canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate the new dimensions
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

            // Set canvas size
            canvas.width = width;
            canvas.height = height;

            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Get the resized image data URL
            const resizedImageDataUrl = canvas.toDataURL('image/png');

            // Update state with the resized image
            setInvoiceData(prevState => ({
                ...prevState,
                logo: resizedImageDataUrl
            }));
        };
        img.src = e.target.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
};

  
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
  
    setInvoiceData(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    if (name.includes('.')) {
      // Handling nested properties
      const [property, subProperty] = name.split('.');
      setInvoiceData(prevState => ({
        ...prevState,
        [property]: {
          ...prevState[property],
          [subProperty]: value
        }
      }));
    } else {
      // Handling top-level properties
      setInvoiceData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  

  const handleItemChange = (index, field, event) => {
    const newItems = [...invoiceData.items];
    const value = event.target.value;
    const updatedItem = { ...newItems[index], [field]: value };
  
    // Calculate the amount when rate or quantity changes
    if (field === 'rate' || field === 'quantity') {
      updatedItem.amount = (parseFloat(updatedItem.rate) * parseFloat(updatedItem.quantity)) || 0;
    }
  
    // Calculate the GST amount when rate, quantity, or GST percentage changes
    if (field === 'rate' || field === 'quantity' || field === 'gstPercentage') {
      updatedItem.gstAmount = ((updatedItem.amount * parseFloat(updatedItem.gstPercentage)) / 100) || 0;
    }
  
    newItems[index] = updatedItem;
    setInvoiceData(prevState => ({
      ...prevState,
      items: newItems
    }));
  };
  
  

useEffect(() => {
  const totalAmount = invoiceData.items.reduce((total, item) => {
    return total + item.amount + item.gstAmount; // Include GST in the total
  }, 0);
  setInvoiceData(prevState => ({
    ...prevState,
    total: totalAmount
  }));
}, [invoiceData.items]);
  


  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const togglePhoneNumber = (event) => {
    event.preventDefault();  // Prevent the default form submit behavior
    setShowPhoneNumber(!showPhoneNumber);
  };

  const [showEmail, setShowEmail] = useState(false);
  const toggleEmail = (event) => {
    event.preventDefault();  // Prevent the default form submit behavior
    setShowEmail(!showEmail);
  };

  const [showPan, setShowPan] = useState(false);
  const togglePan = (event) => {
    event.preventDefault();  // Prevent the default form submit behavior
    setShowPan(!showPan);
  };

  const [showPhoneNumber2, setShowPhoneNumber2] = useState(false);
  const togglePhoneNumber2 = (event) => {
    event.preventDefault();  // Prevent the default form submit behavior
    setShowPhoneNumber2(!showPhoneNumber2);
  };

  const [showEmail2, setShowEmail2] = useState(false);
  const toggleEmail2 = (event) => {
    event.preventDefault();  // Prevent the default form submit behavior
    setShowEmail2(!showEmail2);
  };

  const [showPan2, setShowPan2] = useState(false);
  const togglePan2 = (event) => {
    event.preventDefault();  // Prevent the default form submit behavior
    setShowPan2(!showPan2);
  };

  
  const [showDiscount, setShowDiscount] = useState(false);

  const toggleDiscount = (event) => {
    event.preventDefault(); // Prevent the default form submit behavior
    setShowDiscount(!showDiscount);
  };
  

  const downloadInvoice = () => {
    // Assuming the invoice is rendered in a div with a unique id 'invoice-preview'
    const invoiceElement = document.getElementById('invoice-preview');
  
    html2canvas(invoiceElement)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
        });
  
        // Add the image to the PDF. You might need to adjust the x, y, width, and height
        pdf.addImage(imgData, 'PNG', 10, 10);
        pdf.save('invoice.pdf');
      })
      .catch(err => {
        console.error("Error generating PDF", err);
      });
  };

  const addItem = (event) => {
    event.preventDefault();
    setInvoiceData(prevState => ({
      ...prevState,
      items: [
        ...prevState.items, 
        { 
          name: '', 
          description: '', 
          quantity: 1, 
          rate: 0, 
          amount: 0, 
          gstPercentage: 0,
          gstAmount: 0,
          thumbnail: ''
        }
      ]
    }));
  };
  
  const removeItem = (index) => {
    event.preventDefault();
    setInvoiceData(prevState => {
      const newItems = [...prevState.items];
      newItems.splice(index, 1);
      return { ...prevState, items: newItems };
    });
  };
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);

  // States for number format options
  const [numberFormat, setNumberFormat] = useState('Arabic'); // Default to 'Arabic'
  const [decimalDigits, setDecimalDigits] = useState(2); // Default to 2 decimal places
  const [customCurrencySymbol, setCustomCurrencySymbol] = useState('₹'); // Default to INR symbol

  // Function to open the format modal
  const openFormatModal = () => {
    setIsFormatModalOpen(true);
  };

  // Function to handle input changes in the modal
  const handleFormatChange = (e) => {
    const { name, value } = e.target;
    if (name === 'numberFormat') setNumberFormat(value);
    else if (name === 'decimalDigits') setDecimalDigits(value);
    else if (name === 'customCurrencySymbol') setCustomCurrencySymbol(value);
  };

  // Function to save changes and close modal
  const saveChanges = () => {
    // Apply the formatting changes to your invoice data here
    setIsFormatModalOpen(false);
  };

  // Function to cancel and close modal
  const cancelChanges = () => {
    setIsFormatModalOpen(false);
  };

  // Render the modal window
  const renderFormatModal = () => {
    if (!isFormatModalOpen) return null;

    return (
      <Modal onClose={() => setIsFormatModalOpen(false)}>
        <div className='modelui'>
          <label>Number Format</label>
          <select name="numberFormat" onChange={handleFormatChange}>
            <option value="Arabic">Arabic</option>
            <option value="Roman">Roman</option>
          </select>

          <label>Decimal Digits</label>
          <input
            type="number"
            name="decimalDigits"
            value={decimalDigits}
            onChange={handleFormatChange}
          />

          <label>Custom Currency Symbol</label>
          <input
            type="text"
            name="customCurrencySymbol"
            value={customCurrencySymbol}
            onChange={handleFormatChange}
          />

          <button onClick={saveChanges}>Save Changes</button>
          <button onClick={cancelChanges}>Cancel</button>
        </div>
      </Modal>
    );
  };

  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
 
  const toggleDiscountInput = () => {
    event.preventDefault();
    setShowDiscountInput(!showDiscountInput);
  };
  
  const handleDiscountChange = (event) => {
    event.preventDefault();
    setDiscountPercentage(event.target.value);
  };
  
  const applyDiscount = () => {
    event.preventDefault();
    const discountAmount = (invoiceData.total * discountPercentage) / 100;
    setInvoiceData(prevState => ({
      ...prevState,
      discountsAdditionalCharges: {
        ...prevState.discountsAdditionalCharges,
        discount: discountAmount
      },
      total: prevState.total - discountAmount
    }));
  };
  
  const removeDiscount = () => {
    event.preventDefault();
    setDiscountPercentage(0);
  
    // Recalculate the total amount without the discount
    const originalTotal = invoiceData.items.reduce((total, item) => total + item.amount + item.gstAmount, 0);
    setInvoiceData(prevState => ({
      ...prevState,
      total: originalTotal
    }));
  };

  const [showAdditionalChargesInput, setShowAdditionalChargesInput] = useState(false);
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [additionalChargesDescription, setAdditionalChargesDescription] = useState('');

  const toggleAdditionalChargesInput = () => {
    event.preventDefault();
    setShowAdditionalChargesInput(!showAdditionalChargesInput);
  };
  
  const handleAdditionalChargesChange = (event) => {
    setAdditionalCharges(event.target.value);
  };
  
  const handleAdditionalChargesDescriptionChange = (event) => {
    setAdditionalChargesDescription(event.target.value);
  };

  const applyAdditionalCharges = () => {
    event.preventDefault();
    setInvoiceData(prevState => ({
      ...prevState,
      discountsAdditionalCharges: {
        ...prevState.discountsAdditionalCharges,
        additionalCharges: parseFloat(additionalCharges) // Convert to a number and update
      },
      total: prevState.total + parseFloat(additionalCharges)
    }));
  };
  

  const removeAdditionalCharges = () => {
    event.preventDefault();
    setAdditionalCharges(0);
    setAdditionalChargesDescription('');
    setInvoiceData(prevState => ({
      ...prevState,
      total: prevState.total - prevState.additionalCharges, // Correctly subtract the additional charges
      additionalCharges: 0 // Reset additional charges in state
    }));
  };
  
  const [terms, setTerms] = useState([]);
  const [newTerm, setNewTerm] = useState('');

  const addTerm = (event) => {
    event.preventDefault();
    setTerms([...terms, ""]);
};

const deleteTerm = (index) => {
    event.preventDefault();
    const updatedTerms = terms.filter((_, idx) => idx !== index);
    setTerms(updatedTerms);
};

const saveTerms = () => {
  event.preventDefault();
  setInvoiceData(prevState => ({
      ...prevState,
      termsConditions: terms.join('\n') // Save as a single string
  }));
  console.log("Terms saved:", terms);
  setShowTermsEditor(false); // Optionally close the editor after saving
};

const [showTermsEditor, setShowTermsEditor] = useState(false);

const toggleTermsEditor = () => {
  event.preventDefault();
    setShowTermsEditor(!showTermsEditor);
};

const closeTermsEditor = () => {
  event.preventDefault();
    setShowTermsEditor(false);
};

const [isRecurring, setIsRecurring] = useState(false);
const [repeatInterval, setRepeatInterval] = useState("Don't repeat");
const [nextRepeatDate, setNextRepeatDate] = useState('');
const [createAsDraft, setCreateAsDraft] = useState(false);

// Handlers for the recurring invoice section
const handleIsRecurringChange = (event) => {
  setIsRecurring(event.target.checked);
};

const handleRepeatIntervalChange = (event) => {
  setRepeatInterval(event.target.value);
};

const handleNextRepeatDateChange = (event) => {
  setNextRepeatDate(event.target.value);
};

const handleCreateAsDraftChange = (event) => {
  setCreateAsDraft(event.target.checked);
};

const handleCheckboxChange1 = (event) => {
  setShowShippingDetails(event.target.checked);
};


  const [shippingDetails, setShippingDetails] = useState({
    shippedFrom: {
      businessFreelancerName: '',
      country: '',
      address: '',
      city: '',
      postalCode: '',
      state: '',
    },
    shippedTo: {
      clientBusinessName: '',
      country: '',
      address: '',
      city: '',
      postalCode: '',
      state: '',
    },
    transportDetails: {
      modeOfTransport: '',
      transporterName: '',
      distanceKm: '',
      transportDoc: '',
      vehicleType: '',
      vehicleNumber: '',
      transactionType: '',
    }
  });

  const handleShippedToChange = (event) => {
    const { name, value } = event.target;
    setShippingDetails(prevDetails => ({
      ...prevDetails,
      shippedTo: {
        ...prevDetails.shippedTo,
        [name]: value
      }
    }));
  };
  const handleTransportDetailsChange = (event) => {
    const { name, value } = event.target;
    setShippingDetails(prevDetails => ({
      ...prevDetails,
      transportDetails: {
        ...prevDetails.transportDetails,
        [name]: value
      }
    }));
  };
  

  // Handlers for the shipping details
  const handleShippedFromChange = (event) => {
    const { name, value } = event.target;
    setShippingDetails(prevDetails => ({
      ...prevDetails,
      shippedFrom: {
        ...prevDetails.shippedFrom,
        [name]: value
      }
    }));
  };

  
  const [showShippingDetails, setShowShippingDetails] = useState(false);


  const saveInvoice = async () => {
    try {
      // Axios configuration for increased payload size
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      };
  
      // Replace with your actual API endpoint
      const response = await axios.post('https://banking-app-backend-se4u.onrender.com/invoice', invoiceData, config);
      console.log('Invoice saved:', response.data);
      // Additional logic upon successful save (e.g., show success message)
    } catch (error) {
      console.error('Error saving invoice:', error);
      // Handle errors (e.g., show error message)
      if (error.response && error.response.status === 413) {
        // Specific logic for handling "Payload Too Large" error
        console.error('The invoice data is too large to be processed by the server.');
      }
    }
  };

// Call this function when the invoice form is submitted




  // ... More functions to handle state changes ...

  return (
    <div className='container'>
    <div className="business-header">
    <DashboardHeader />
  </div>
  <div className="side-navbar">
    <SideNavbar />
  </div>
    <div className="invoice-form">
      <h1 className='header'>Invoice</h1>
      <form>
        {/* Invoice Header */}
        <div className='section1'>
        <div className='Invoicedetails'>
        <input type="text" name="invoiceNo" placeholder="Invoice No" onChange={handleInputChange} />
        <input type="date" name="invoiceDate" placeholder="Invoice Date" onChange={handleInputChange} />
        <input type="date" name="dueDate" placeholder="Due Date" onChange={handleInputChange} />

        </div>
        <div className='business-logo'>
          <input type="file" id="file" onChange={handleLogoChange} />
          <label htmlFor="file"><MdInsertPhoto /> {logoLabel}</label> {/* Include the icon before the text */}
        </div>
        </div>
        {/* Billed By Section */}
        <div className='section2'>
        <div className='Billed-by'>
        <h2>Billed By</h2>
        <div className='bill-by'>
        <input type="text" name="billedBy.name" placeholder="Your Name" onChange={handleInputChange} />
        <input type="text" name="billedBy.address" placeholder="Address" onChange={handleInputChange} />
        <input type="text" name="billedBy.city" placeholder="City" onChange={handleInputChange} />
        <input type="number" name="billedBy.phone" placeholder="Phone number" onChange={handleInputChange} style={{ display: showPhoneNumber ? 'block' : 'none' }} />
        <input type="email" name="billedBy.email" placeholder="Email" className='bill-Email2' onChange={handleInputChange} style={{ display: showEmail ? 'block' : 'none' }} />
        <input type="text" name="billedBy.pan" placeholder="Pan number" onChange={handleInputChange} style={{ display: showPan ? 'block' : 'none' }} />

        <div className='hidebtn'>
        <button onClick={togglePhoneNumber}>
        <FaPhoneAlt />
        {showPhoneNumber ? 'Hide Number' : 'Add Number'}
        </button>
        <button onClick={toggleEmail}>
        <IoIosMail />
        {showEmail ? 'Hide Email' : 'Add Email'}
        </button>
        <button onClick={togglePan}>
        <IoIosMail />
        {showPan ? 'Hide Pan' : 'Add Pan'}
        </button>
        </div>
        </div>
        </div>
        <div className='billed-to'>
        <h2>Billed To</h2>
        {/* Billed To Section */}
        <div className='bill-to'>
        <input type="text" name="billedTo.name" placeholder="Client's Name" onChange={handleInputChange} />
        <input type="text" name="billedTo.address" placeholder="Client's Address" onChange={handleInputChange} />
        <input type="number" name="billedTo.phone" placeholder="Phone number" onChange={handleInputChange} style={{ display: showPhoneNumber2 ? 'block' : 'none' }} />
        <input type="email" name="billedTo.email" placeholder="Email" className='bill-Email2' onChange={handleInputChange} style={{ display: showEmail2 ? 'block' : 'none' }} />
        <input type="text" name="billedTo.pan" placeholder="Pan number" onChange={handleInputChange} style={{ display: showPan2 ? 'block' : 'none' }} />

        <div className='hidebtn'>
        <button onClick={togglePhoneNumber2}>
        <FaPhoneAlt />
        {showPhoneNumber2 ? 'Hide Number' : 'Add Number'}
        </button>
        <button onClick={toggleEmail2}>
        <IoIosMail />
        {showEmail2 ? 'Hide Email' : 'Add Email'}
        </button>
        <button onClick={togglePan2}>
        <IoIosMail />
        {showPan2 ? 'Hide Pan' : 'Add Pan'}
        </button>
        </div>
        </div>
        </div>
        </div>
        <div className='section3'>
        {/* Additional Details */}
        <div className='showship'>
        <input type="checkbox" onChange={handleCheckboxChange1} /> Add Shipping Details

        {showShippingDetails && (
 <div className='shipping-details' style={{ display: showShippingDetails ? 'block' : 'none' }}>
    {/* Shipped From Section */}
    <div className='shippedBoxes'>
    <div className='shipped-section'>
      <h2>Shipped From</h2>
      <input
        type="text"
        name="businessFreelancerName"
        placeholder="Business / Freelancer Name"
        value={shippingDetails.shippedFrom.businessFreelancerName}
        onChange={handleShippedFromChange}
      />
      <select name="country" value={shippingDetails.shippedFrom.country} onChange={handleShippedFromChange}>
        {/* Options for countries */}
      </select>
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={shippingDetails.shippedFrom.address}
        onChange={handleShippedFromChange}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={shippingDetails.shippedFrom.city}
        onChange={handleShippedFromChange}
      />
      <input
        type="text"
        name="postalCode"
        placeholder="Postal Code / Zip"
        value={shippingDetails.shippedFrom.postalCode}
        onChange={handleShippedFromChange}
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        value={shippingDetails.shippedFrom.state}
        onChange={handleShippedFromChange}
      />
    </div>

    {/* Shipped To Section */}
    <div className='shipped-section'>
  <h2>Shipped To</h2>
  <input
    type="text"
    name="clientBusinessName"
    placeholder="Client's Business Name"
    value={shippingDetails.shippedTo.clientBusinessName}
    onChange={handleShippedToChange}
  />
  <input
    type="text"
    name="address"
    placeholder="Address"
    value={shippingDetails.shippedTo.address}
    onChange={handleShippedToChange}
  />
  <input
    type="text"
    name="city"
    placeholder="City"
    value={shippingDetails.shippedTo.city}
    onChange={handleShippedToChange}
  />
  <input
    type="text"
    name="postalCode"
    placeholder="Postal Code / Zip"
    value={shippingDetails.shippedTo.postalCode}
    onChange={handleShippedToChange}
  />
  <input
    type="text"
    name="state"
    placeholder="State"
    value={shippingDetails.shippedTo.state}
    onChange={handleShippedToChange}
  />
</div>

    {/* Transport Details Section */}
    <div className='shipped-section'>
      <h2>Transport Details</h2>
      <select name="modeOfTransport" value={shippingDetails.transportDetails.modeOfTransport} onChange={handleTransportDetailsChange}>
        <option value="road">Road</option>
        <option value="rail">Rail</option>
        <option value="ship">Ship</option>
        <option value="air">Air</option>
      </select>
      <input
        type="text"
        name="transporterName"
        placeholder="Transporter Name"
        value={shippingDetails.transportDetails.transporterName}
        onChange={handleTransportDetailsChange}
      />
      <input
        type="text"
        name="distanceKm"
        placeholder="Distance (in km)"
        value={shippingDetails.transportDetails.distanceKm}
        onChange={handleTransportDetailsChange}
      />
      {/* Add buttons or inputs for 'Add Transport Document', 'Vehicle Type', 'Vehicle Number', etc. */}
    </div>
    </div>
  </div>
)}
        </div>
        <div className='section3-input'>
        <select onChange={handleInputChange}>
            <option value="INR">Indian Rupee (INR)</option>
            {/* ... other currency options ... */}
        </select>
        <button type="button" onClick={openFormatModal}>
        Number/Currency Format
      </button>
      {renderFormatModal()}
        </div>
        </div>
        <div className='section4'>
        <h2>ITEM</h2>
        <div className='items'>
          {invoiceData.items.map((item, index) => (
            <div key={index} className="item">
              <input type="text" placeholder="Item Name" value={item.name || ''} onChange={(e) => handleItemChange(index, 'name', e)} />
              <input type="number" placeholder="Quantity" value={item.quantity || ''} onChange={(e) => handleItemChange(index, 'quantity', e)} />
              <input type="number" placeholder="Rate" value={item.rate || ''} onChange={(e) => handleItemChange(index, 'rate', e)} />
              <input type="number" placeholder="Amount" value={item.amount || ''} readOnly />

              <input type="number" placeholder="GST %" value={item.gstPercentage || ''} onChange={(e) => handleItemChange(index, 'gstPercentage', e)} />
              <p>GST Amount: {item.gstAmount.toFixed(2)}</p>
              <div className='discription'>
              <input
                  type="text"
                  placeholder="Description"
                  name='discription'
                  value={item.description || ''}
                  onChange={(e) => handleItemChange(index, 'description', e)}
                />
                </div>
              <div className='remove-btn'>
                <button className='remove-item' onClick={() => removeItem(index)}><MdCancel /></button>
              </div>
            </div>
          ))}
        </div>
        <button className='add-item' onClick={addItem}>Add More Items<IoIosAdd /></button>
      </div>

        <div className='section5'>
        {/* Summary Section */}
        <button onClick={toggleDiscount}>
        <MdOutlineDiscount />Give Item wise Discount
        </button>
        <div className={`discountbtn ${showDiscount ? 'show' : ''}`}>
        <button onClick={toggleDiscountInput}>
        <TbDiscount />Give Discount on Total
        </button>
        {showDiscountInput && (
          <div className="discount-container">
            <input 
              type="number" 
              name="discountPercentage"
              placeholder="Discount Percentage" 
              value={discountPercentage} 
              onChange={handleDiscountChange} 
            />
            <div className='DiscountBtn-C'>
        <button className="apply-discount-btn" onClick={applyDiscount}><MdFileDownloadDone />Apply Discount</button>
        <button className="remove-discount-btn" onClick={removeDiscount}><IoRemoveCircleOutline />Remove Discount</button>
        </div>
          </div>
        )}
      <button onClick={toggleAdditionalChargesInput}>
          <TbReportMoney />Add Additional Charges
        </button>
        {showAdditionalChargesInput && (
          <div>
            <div className='additionalCharge'>
            <input 
              type="text" 
              name="additionalChargesDescription"
              placeholder="Description of Additional Charges" 
              value={additionalChargesDescription} 
              onChange={handleAdditionalChargesDescriptionChange} 
            />
            <input 
              type="number" 
              name="additionalCharges"
              placeholder="Additional Charges Amount" 
              value={additionalCharges} 
              onChange={handleAdditionalChargesChange} 
            />
            </div>
            <div className='applyAdditionalBtn'>
            <button onClick={applyAdditionalCharges}><MdFileDownloadDone />Apply Additional Charges</button>
            {/* <button onClick={removeAdditionalCharges}><IoRemoveCircleOutline />Remove Additional Charges</button> */}
            </div>
          </div>
        )}
        </div>
        <div className='total'>
          <h2>Total (INR): {invoiceData.total.toFixed(2)}</h2>
          <button onClick={handleShowTotalInWords}>
            <RiMoneyDollarCircleLine /> Show Total in Words
          </button>
          {totalInWords && <p>Total in Words: {totalInWords}</p>}
        </div>
        </div>
        {/* Terms, Notes, and Recurring Invoice */}
         <div className='termsconditions'>     
        <button onClick={toggleTermsEditor}>Add/Edit Terms & Conditions</button>
        </div> 
          {showTermsEditor && (
              <div className='section6'>
                  <ul>
                      {terms.map((term, index) => (
                          <li key={index}>
                              <input 
                                  type="text" 
                                  value={term} 
                                  onChange={(e) => {
                                      const updatedTerms = [...terms];
                                      updatedTerms[index] = e.target.value;
                                      setTerms(updatedTerms);
                                  }} 
                              />
                              <button onClick={() => deleteTerm(index)}><MdCancel /></button>
                          </li>
                      ))}
                  </ul>
                  <div className='termsbtn'>
                  <button onClick={addTerm}><IoAdd />Add Terms</button>
                  {terms.length > 0 && <button onClick={saveTerms}>Save Terms & Conditions</button>}
                  <button onClick={closeTermsEditor}>Close Editor</button>
                  </div>
              </div>
          )}
          
        {/* Displaying the terms as points on the invoice */}
        <div className="terms-display">
            {invoiceData.termsConditions && invoiceData.termsConditions.split('\n').map((term, index) => (
                <p key={index}>• {term}</p>
            ))}
        </div>
        <div className="recurring-invoice-section">
        <label>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={handleIsRecurringChange}
          />{' '}
          This is a recurring invoice.
        </label>
        {isRecurring && (
          <>
          <div className='recurring-item'>
            <div>
              <label>Invoice repeats</label>
              <select value={repeatInterval} name='nextRepeatDate' onChange={handleRepeatIntervalChange}>
                <option>Don't repeat</option>
                <option>Every week</option>
                <option>Every month</option>
                <option>Every year</option>
                <option>Every 2 years</option>
                <option>Every 3 years</option>
                <option>Every 5 years</option>
              </select>
            </div>
            <div>
              <label>Next Repeat Date</label>
              <input
                type="date"
                name='nextRepeatDate'
                value={nextRepeatDate}
                onChange={handleNextRepeatDateChange}
              />
            </div>
            <div>
              <div className='draft'>
              <label>
                <input
                  type="checkbox"
                  checked={createAsDraft}
                  onChange={handleCreateAsDraftChange}
                />
                Create as Draft
              </label>
              <p>Create a draft of the new invoice. I will approve and send it to the client.</p>
            </div>
            <div className='recurring-para'>
              <p>Repeat Interval: {repeatInterval}</p>
              <p>Next Repeat Date: {nextRepeatDate}</p>
            </div>
            </div>
            </div>
          </>
        )}
      </div>
        
        </form>
        <div className='lastbtn'>

        <div style={{ display: 'none' }}>
        <PrintInvoice ref={printComponentRef} invoiceData={invoiceData} shippingDetails={shippingDetails} />
        </div>

        <ReactToPrint
          trigger={() => <button type="button">Download Invoice</button>}
          content={() => printComponentRef.current}
        />
      <button type="button" onClick={saveInvoice}>Save Invoice</button>
      <div ref={invoiceRef} style={{ display: 'none' }}>
        {/* Rendered invoice for print */}
        </div>
      </div>
    </div>
    </div>
  );
};

export default InvoiceForm;
