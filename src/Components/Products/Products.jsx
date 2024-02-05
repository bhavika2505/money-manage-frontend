import React, { useState, useEffect } from 'react';
import './Products.css';
import ProductForm from '../ProductForm/ProductForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


function Products() {
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);

  const handleFilterChange = (newFilter) => {
    setCurrentFilter(newFilter);
  };

  const resetFilters = () => {
    setCurrentFilter('all');
    setSearchTerm('');
    setMinPrice(0);
    setMaxPrice(Infinity);
  };

  const filteredProducts = products.filter((product) => {
    if (currentFilter === 'low') {
      return product.openingStock <= product.lowStockAlert;
    }
    return product.itemName.toLowerCase().includes(searchTerm.toLowerCase()); // If 'all' is selected, return all products
  });

  const getFilteredProducts = () => {
    return products
      .filter((product) => {
        if (currentFilter === 'low') {
          return product.openingStock <= product.lowStockAlert;
        }
        return true;
      })
      .filter((product) => product.itemName.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((product) => {
        const price = parseFloat(product.salePrice); // Ensure this is a number
        const min = parseFloat(minPrice); // Convert from string to number
        const max = parseFloat(maxPrice); // Convert from string to number
        return price >= min && price <= max;
      });
  };

  const downloadPDF = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A4 paper size
    const orientation = 'portrait';
  
    const doc = new jsPDF(orientation, unit, size);
  
    doc.setFontSize(12);
  
    const title = "Products Data";
    const headers = [["Product Name", "Sale Price", "Stock"]];
  
    const data = getFilteredProducts().map(product => [
      product.itemName, 
      `₹${product.salePrice}`, 
      product.openingStock
    ]);
  
    let content = {
      startY: 50,
      head: headers,
      body: data,
    };
  
    doc.text(title, 40, 40);
    doc.autoTable(content);
    doc.save("products.pdf");
  }


  const downloadExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
  
    const dataToDownload = getFilteredProducts().map(product => ({
      Name: product.itemName,
      Price: product.salePrice,
      Stock: product.openingStock
    }));
  
    const ws = XLSX.utils.json_to_sheet(dataToDownload);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    
    FileSaver.saveAs(data, "products" + fileExtension);
  };
  
  const getTotalStock = () => {
    return products.reduce((total, product) => total + product.openingStock, 0);
  };

  // Function to calculate count of low stock items
  const getLowStockCount = () => {
    return products.filter(product => product.openingStock <= product.lowStockAlert).length;
  };

  // Function to calculate total sales price
  const getTotalSalesPrice = () => {
    return products.reduce((total, product) => total + parseFloat(product.salePrice), 0);
  };

  // Function to get the number of products
  const getProductCount = () => {
    return products.length;
  };


  const handleProductFormSubmit = async (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://banking-app-backend-se4u.onrender.com/products');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      setProducts(data);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };
  
  // Call fetchProducts when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);// Empty dependency array means this effect will only run once on mount

  const addProduct = () => {
    setShowProductForm(true); // Show the ProductForm as a modal
  };

  const handleClose = () => {
    setShowProductForm(false); // Hide the modal
  };

  const updateStock = async (productId, operation) => {
    try {
      const response = await fetch(`https://banking-app-backend-se4u.onrender.com/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const updatedProduct = await response.json();
  
      // Now that updatedProduct is defined, you can use it
      if (updatedProduct.openingStock <= updatedProduct.lowStockAlert) {
        setShowLowStockModal(true);
      }
  
      // Update the product in the state
      setProducts(products.map(product => product._id === productId ? updatedProduct : product));
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const filteredProductname = getFilteredProducts();
  // Render the UI if no products have been added yet
  return (
    <div className="products-page">
      <div className="header-container">
      <div className="dashboard-prod">
          <div className='uper-dash'>
        <div className="dashboard-item">
          <span>Total Stock</span>
          <span>{getTotalStock()}</span>
        </div>
        <div className="dashboard-item">
          <span>Low Stock Items</span>
          <span>{getLowStockCount()}</span>
        </div>
        </div>
        <div className='uper-dash'>
        <div className="dashboard-item">
          <span>Total Sales Price</span>
          <span>₹{getTotalSalesPrice().toFixed(2)}</span>
        </div>
        <div className="dashboard-item">
          <span>Number of Products</span>
          <span>{getProductCount()}</span>
        </div>
        </div>
      </div>
        <div className="price-range">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="product-search-bar"
        />
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
          />
           <button onClick={resetFilters} className="remove-filters-btn">
              Remove Filters
            </button>
        </div>
        <div className='download-btn-product'>
        <button onClick={downloadPDF} className="download-pdf-btn">
          Download PDF
        </button>
        <button onClick={downloadExcel} className="download-excel-btn">
          Download Excel
        </button>
      </div>
        {products.length === 0 && (
          
          <div className="services-list">
              <h1>Add Items And Get Started</h1>
            <div className="service-item">
              <span className="service-icon">📦</span>
              <span>Manage stock in/out & get low stock alerts</span>
            </div>
            <div className="service-item">
              <span className="service-icon">📝</span>
              <span>Detailed stock history with notes</span>
            </div>
            <div className="service-item">
              <span className="service-icon">💹</span>
              <span>Track purchase/sale price & profits</span>
            </div>
          </div>
        )}
      </div>

      {filteredProducts.length > 0 && (
        <> 
          <div className="filter-buttons">
            <button onClick={() => handleFilterChange('all')} className={currentFilter === 'all' ? 'active' : ''}>
              All Items
            </button>
            <button onClick={() => handleFilterChange('low')} className={currentFilter === 'low' ? 'active' : ''}>
              Low Stock
            </button>
          </div>
          {  getFilteredProducts().map((product) => (
            <div key={product._id} className="product-item">
                {product.openingStock <= product.lowStockAlert && (
              <div className="low-stock-tag">Low Stock</div>
            )}
              <div className="product-details">
                <div className='productname'>
              <img src={product.productImage} alt={product.itemName} />
                <h3>{product.itemName}</h3>
                </div>
                <div className='sales-stock'>
                <p>Sale Price: ₹{product.salePrice}</p>
                <p>Current Stock: {product.openingStock}</p>
                </div>
              </div>
              <div className="product-actions">
                <button className="in" onClick={() => updateStock(product._id, 'increment')}>+ IN</button>
                <button className="out" onClick={() => updateStock(product._id, 'decrement')}>- OUT</button>
              </div>
            </div>
          ))}
        </>
      )}

      {showLowStockModal && (
        <div className="low-stock-modal">
          <p>One or more items have low stock!</p>
          <button onClick={() => setShowLowStockModal(false)}>Close</button>
        </div>
      )}

      <button className="add-product-btn" onClick={addProduct}>
        ADD PRODUCT
      </button>

      {showProductForm && (
        <div className="product-form-modal">
         <ProductForm onProductSubmit={handleProductFormSubmit}
         onClose={ handleClose} 
         updateProduct={ fetchProducts }
         />

          <button className="close-modal-btn" onClick={handleClose}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Products;
