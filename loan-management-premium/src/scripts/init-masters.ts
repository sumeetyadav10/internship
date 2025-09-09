import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Initialize masters data for Goa state
async function initializeMastersData() {
  console.log('Initializing masters data...');
  
  const mastersData = {
    districts: [
      { code: 'NORTH_GOA', name: 'North Goa', active: true },
      { code: 'SOUTH_GOA', name: 'South Goa', active: true }
    ],
    talukas: [
      // North Goa Talukas
      { code: 'BARDEZ', name: 'Bardez', districtCode: 'NORTH_GOA', active: true },
      { code: 'BICHOLIM', name: 'Bicholim', districtCode: 'NORTH_GOA', active: true },
      { code: 'PERNEM', name: 'Pernem', districtCode: 'NORTH_GOA', active: true },
      { code: 'PONDA', name: 'Ponda', districtCode: 'NORTH_GOA', active: true },
      { code: 'SATTARI', name: 'Sattari', districtCode: 'NORTH_GOA', active: true },
      { code: 'TISWADI', name: 'Tiswadi', districtCode: 'NORTH_GOA', active: true },
      
      // South Goa Talukas
      { code: 'CANACONA', name: 'Canacona', districtCode: 'SOUTH_GOA', active: true },
      { code: 'MORMUGAO', name: 'Mormugao', districtCode: 'SOUTH_GOA', active: true },
      { code: 'QUEPEM', name: 'Quepem', districtCode: 'SOUTH_GOA', active: true },
      { code: 'SALCETE', name: 'Salcete', districtCode: 'SOUTH_GOA', active: true },
      { code: 'SANGUEM', name: 'Sanguem', districtCode: 'SOUTH_GOA', active: true },
      { code: 'DHARBANDORA', name: 'Dharbandora', districtCode: 'SOUTH_GOA', active: true }
    ],
    villages: [
      // Bardez villages
      { code: 'CALANGUTE', name: 'Calangute', talukaCode: 'BARDEZ', districtCode: 'NORTH_GOA', pincode: '403516', active: true },
      { code: 'CANDOLIM', name: 'Candolim', talukaCode: 'BARDEZ', districtCode: 'NORTH_GOA', pincode: '403515', active: true },
      { code: 'MAPUSA', name: 'Mapusa', talukaCode: 'BARDEZ', districtCode: 'NORTH_GOA', pincode: '403507', active: true },
      { code: 'ANJUNA', name: 'Anjuna', talukaCode: 'BARDEZ', districtCode: 'NORTH_GOA', pincode: '403509', active: true },
      { code: 'ARPORA', name: 'Arpora', talukaCode: 'BARDEZ', districtCode: 'NORTH_GOA', pincode: '403518', active: true },
      { code: 'ASSAGAO', name: 'Assagao', talukaCode: 'BARDEZ', districtCode: 'NORTH_GOA', pincode: '403507', active: true },
      
      // Tiswadi villages
      { code: 'PANAJI', name: 'Panaji', talukaCode: 'TISWADI', districtCode: 'NORTH_GOA', pincode: '403001', active: true },
      { code: 'BAMBOLIM', name: 'Bambolim', talukaCode: 'TISWADI', districtCode: 'NORTH_GOA', pincode: '403202', active: true },
      { code: 'ST_CRUZ', name: 'St. Cruz', talukaCode: 'TISWADI', districtCode: 'NORTH_GOA', pincode: '403005', active: true },
      { code: 'TALEIGAO', name: 'Taleigao', talukaCode: 'TISWADI', districtCode: 'NORTH_GOA', pincode: '403002', active: true },
      
      // Ponda villages
      { code: 'PONDA_CITY', name: 'Ponda City', talukaCode: 'PONDA', districtCode: 'NORTH_GOA', pincode: '403401', active: true },
      { code: 'CURTI', name: 'Curti', talukaCode: 'PONDA', districtCode: 'NORTH_GOA', pincode: '403401', active: true },
      { code: 'PRIOL', name: 'Priol', talukaCode: 'PONDA', districtCode: 'NORTH_GOA', pincode: '403108', active: true },
      { code: 'MARCELA', name: 'Marcela', talukaCode: 'PONDA', districtCode: 'NORTH_GOA', pincode: '403107', active: true },
      
      // Salcete villages
      { code: 'MARGAO', name: 'Margao', talukaCode: 'SALCETE', districtCode: 'SOUTH_GOA', pincode: '403601', active: true },
      { code: 'BENAULIM', name: 'Benaulim', talukaCode: 'SALCETE', districtCode: 'SOUTH_GOA', pincode: '403716', active: true },
      { code: 'COLVA', name: 'Colva', talukaCode: 'SALCETE', districtCode: 'SOUTH_GOA', pincode: '403708', active: true },
      { code: 'VARCA', name: 'Varca', talukaCode: 'SALCETE', districtCode: 'SOUTH_GOA', pincode: '403721', active: true },
      { code: 'NAVELIM', name: 'Navelim', talukaCode: 'SALCETE', districtCode: 'SOUTH_GOA', pincode: '403707', active: true },
      
      // Mormugao villages
      { code: 'VASCO', name: 'Vasco da Gama', talukaCode: 'MORMUGAO', districtCode: 'SOUTH_GOA', pincode: '403802', active: true },
      { code: 'DABOLIM', name: 'Dabolim', talukaCode: 'MORMUGAO', districtCode: 'SOUTH_GOA', pincode: '403801', active: true },
      { code: 'BOGMALO', name: 'Bogmalo', talukaCode: 'MORMUGAO', districtCode: 'SOUTH_GOA', pincode: '403806', active: true },
      
      // Bicholim villages
      { code: 'BICHOLIM_CITY', name: 'Bicholim', talukaCode: 'BICHOLIM', districtCode: 'NORTH_GOA', pincode: '403504', active: true },
      { code: 'SANQUELIM', name: 'Sanquelim', talukaCode: 'BICHOLIM', districtCode: 'NORTH_GOA', pincode: '403505', active: true },
      { code: 'MAYEM', name: 'Mayem', talukaCode: 'BICHOLIM', districtCode: 'NORTH_GOA', pincode: '403504', active: true },
      
      // Pernem villages
      { code: 'PERNEM_CITY', name: 'Pernem', talukaCode: 'PERNEM', districtCode: 'NORTH_GOA', pincode: '403512', active: true },
      { code: 'ARAMBOL', name: 'Arambol', talukaCode: 'PERNEM', districtCode: 'NORTH_GOA', pincode: '403524', active: true },
      { code: 'MANDREM', name: 'Mandrem', talukaCode: 'PERNEM', districtCode: 'NORTH_GOA', pincode: '403527', active: true },
      
      // Canacona villages
      { code: 'CHAUDI', name: 'Chaudi', talukaCode: 'CANACONA', districtCode: 'SOUTH_GOA', pincode: '403702', active: true },
      { code: 'PALOLEM', name: 'Palolem', talukaCode: 'CANACONA', districtCode: 'SOUTH_GOA', pincode: '403702', active: true },
      { code: 'AGONDA', name: 'Agonda', talukaCode: 'CANACONA', districtCode: 'SOUTH_GOA', pincode: '403702', active: true },
      
      // Sanguem villages
      { code: 'SANGUEM_CITY', name: 'Sanguem', talukaCode: 'SANGUEM', districtCode: 'SOUTH_GOA', pincode: '403704', active: true },
      { code: 'RIVONA', name: 'Rivona', talukaCode: 'SANGUEM', districtCode: 'SOUTH_GOA', pincode: '403704', active: true },
      
      // Quepem villages
      { code: 'QUEPEM_CITY', name: 'Quepem', talukaCode: 'QUEPEM', districtCode: 'SOUTH_GOA', pincode: '403705', active: true },
      { code: 'BALLI', name: 'Balli', talukaCode: 'QUEPEM', districtCode: 'SOUTH_GOA', pincode: '403705', active: true },
      
      // Sattari villages
      { code: 'VALPOI', name: 'Valpoi', talukaCode: 'SATTARI', districtCode: 'NORTH_GOA', pincode: '403506', active: true },
      { code: 'SANVORDEM', name: 'Sanvordem', talukaCode: 'SATTARI', districtCode: 'NORTH_GOA', pincode: '403506', active: true },
      
      // Dharbandora villages
      { code: 'DHARBANDORA_CITY', name: 'Dharbandora', talukaCode: 'DHARBANDORA', districtCode: 'SOUTH_GOA', pincode: '403410', active: true },
      { code: 'MOLLEM', name: 'Mollem', talukaCode: 'DHARBANDORA', districtCode: 'SOUTH_GOA', pincode: '403410', active: true }
    ]
  };

  try {
    // Write masters data to Firestore
    await setDoc(doc(db, 'masters', 'locations'), mastersData);
    console.log('Masters data initialized successfully!');
    
    // Initialize empty statistics
    const initialStats = {
      totalApplications: 0,
      draftApplications: 0,
      submittedApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUpdated: new Date()
    };
    
    await setDoc(doc(db, 'statistics', 'dashboard'), initialStats);
    console.log('Statistics initialized successfully!');
    
  } catch (error) {
    console.error('Error initializing masters data:', error);
  }
}

// Run the initialization
initializeMastersData();