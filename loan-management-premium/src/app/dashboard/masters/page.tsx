"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query,
  orderBy 
} from "firebase/firestore";
import { toast } from "sonner";
import { ArrowLeft, Printer, Database } from "lucide-react";

interface District {
  code: string;
  name: string;
  active: boolean;
}

interface Taluka {
  code: string;
  name: string;
  districtCode: string;
  active: boolean;
}

interface Village {
  code: string;
  name: string;
  districtCode: string;
  talukaCode: string;
  pincode?: string;
  active: boolean;
}

export default function MastersPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<'districts' | 'talukas' | 'villages'>('districts');
  const [districts, setDistricts] = useState<District[]>([]);
  const [talukas, setTalukas] = useState<Taluka[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [districtForm, setDistrictForm] = useState({ name: '', code: '', active: true });
  const [talukaForm, setTalukaForm] = useState({ name: '', code: '', districtCode: '', active: true });
  const [villageForm, setVillageForm] = useState({ name: '', code: '', districtCode: '', talukaCode: '', pincode: '', active: true });
  
  // Search states
  const [districtSearch, setDistrictSearch] = useState('');
  const [talukaSearch, setTalukaSearch] = useState('');
  const [villageSearch, setVillageSearch] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      await loadAllData();
    });

    return () => unsubscribe();
  }, [router]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadDistricts(),
        loadTalukas(),
        loadVillages()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadDistricts = async () => {
    try {
      const q = query(collection(db, "masters/locations/districts"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const districtsData: District[] = [];
      querySnapshot.forEach((doc) => {
        districtsData.push(doc.data() as District);
      });
      setDistricts(districtsData);
    } catch (error) {
      console.error("Error loading districts:", error);
    }
  };

  const loadTalukas = async () => {
    try {
      const q = query(collection(db, "masters/locations/talukas"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const talukasData: Taluka[] = [];
      querySnapshot.forEach((doc) => {
        talukasData.push(doc.data() as Taluka);
      });
      setTalukas(talukasData);
    } catch (error) {
      console.error("Error loading talukas:", error);
    }
  };

  const loadVillages = async () => {
    try {
      const q = query(collection(db, "masters/locations/villages"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const villagesData: Village[] = [];
      querySnapshot.forEach((doc) => {
        villagesData.push(doc.data() as Village);
      });
      setVillages(villagesData);
    } catch (error) {
      console.error("Error loading villages:", error);
    }
  };

  const saveDistrict = async () => {
    if (!districtForm.name.trim() || !districtForm.code.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await setDoc(doc(db, "masters/locations/districts", districtForm.code), {
        code: districtForm.code,
        name: districtForm.name,
        active: districtForm.active
      });
      
      toast.success("District saved successfully!");
      setDistrictForm({ name: '', code: '', active: true });
      await loadDistricts();
    } catch (error) {
      console.error("Error saving district:", error);
      toast.error("Failed to save district");
    }
  };

  const saveTaluka = async () => {
    if (!talukaForm.name.trim() || !talukaForm.code.trim() || !talukaForm.districtCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await setDoc(doc(db, "masters/locations/talukas", talukaForm.code), {
        code: talukaForm.code,
        name: talukaForm.name,
        districtCode: talukaForm.districtCode,
        active: talukaForm.active
      });
      
      toast.success("Taluka saved successfully!");
      setTalukaForm({ name: '', code: '', districtCode: '', active: true });
      await loadTalukas();
    } catch (error) {
      console.error("Error saving taluka:", error);
      toast.error("Failed to save taluka");
    }
  };

  const saveVillage = async () => {
    if (!villageForm.name.trim() || !villageForm.code.trim() || !villageForm.districtCode || !villageForm.talukaCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await setDoc(doc(db, "masters/locations/villages", villageForm.code), {
        code: villageForm.code,
        name: villageForm.name,
        districtCode: villageForm.districtCode,
        talukaCode: villageForm.talukaCode,
        pincode: villageForm.pincode,
        active: villageForm.active
      });
      
      toast.success("Village saved successfully!");
      setVillageForm({ name: '', code: '', districtCode: '', talukaCode: '', pincode: '', active: true });
      await loadVillages();
    } catch (error) {
      console.error("Error saving village:", error);
      toast.error("Failed to save village");
    }
  };

  const deleteDistrict = async (code: string) => {
    if (!confirm("Are you sure you want to delete this district?")) return;
    
    try {
      await deleteDoc(doc(db, "masters/locations/districts", code));
      toast.success("District deleted successfully!");
      await loadDistricts();
    } catch (error) {
      console.error("Error deleting district:", error);
      toast.error("Failed to delete district");
    }
  };

  const deleteTaluka = async (code: string) => {
    if (!confirm("Are you sure you want to delete this taluka?")) return;
    
    try {
      await deleteDoc(doc(db, "masters/locations/talukas", code));
      toast.success("Taluka deleted successfully!");
      await loadTalukas();
    } catch (error) {
      console.error("Error deleting taluka:", error);
      toast.error("Failed to delete taluka");
    }
  };

  const deleteVillage = async (code: string) => {
    if (!confirm("Are you sure you want to delete this village?")) return;
    
    try {
      await deleteDoc(doc(db, "masters/locations/villages", code));
      toast.success("Village deleted successfully!");
      await loadVillages();
    } catch (error) {
      console.error("Error deleting village:", error);
      toast.error("Failed to delete village");
    }
  };

  const filteredDistricts = districts.filter(d => 
    d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
    d.code.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredTalukas = talukas.filter(t => 
    t.name.toLowerCase().includes(talukaSearch.toLowerCase()) ||
    t.code.toLowerCase().includes(talukaSearch.toLowerCase())
  );

  const filteredVillages = villages.filter(v => 
    v.name.toLowerCase().includes(villageSearch.toLowerCase()) ||
    v.code.toLowerCase().includes(villageSearch.toLowerCase())
  );

  const globalSearchResults = () => {
    if (!globalSearch) return null;
    
    const search = globalSearch.toLowerCase();
    const districtResults = districts.filter(d => 
      d.name.toLowerCase().includes(search) || d.code.toLowerCase().includes(search)
    );
    const talukaResults = talukas.filter(t => 
      t.name.toLowerCase().includes(search) || t.code.toLowerCase().includes(search)
    );
    const villageResults = villages.filter(v => 
      v.name.toLowerCase().includes(search) || v.code.toLowerCase().includes(search)
    );

    return { districtResults, talukaResults, villageResults };
  };

  const searchResults = globalSearchResults();

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ margin: 0, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: "#f0f2f5", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "30px" }}>
        {/* Header */}
        <div style={{ background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, color: "#1a1a1a", fontSize: "32px", fontWeight: "700" }}>Masters Management</h1>
          <button 
            onClick={() => router.push("/dashboard")}
            style={{ background: "#5a67d8", color: "white", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(90, 103, 216, 0.3)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#4c51bf"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#5a67d8"}
          >
            <ArrowLeft style={{ width: "18px", height: "18px" }} />
            Back to Dashboard
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "30px", background: "white", padding: "12px", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <button 
            onClick={() => setCurrentTab('districts')}
            style={{ padding: "14px 28px", background: currentTab === 'districts' ? "#3b82f6" : "#f3f4f6", color: currentTab === 'districts' ? "white" : "#4b5563", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "500", transition: "all 0.3s", boxShadow: currentTab === 'districts' ? "0 2px 8px rgba(59, 130, 246, 0.3)" : "none" }}
          >
            Districts
          </button>
          <button 
            onClick={() => setCurrentTab('talukas')}
            style={{ padding: "14px 28px", background: currentTab === 'talukas' ? "#3b82f6" : "#f3f4f6", color: currentTab === 'talukas' ? "white" : "#4b5563", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "500", transition: "all 0.3s", boxShadow: currentTab === 'talukas' ? "0 2px 8px rgba(59, 130, 246, 0.3)" : "none" }}
          >
            Talukas
          </button>
          <button 
            onClick={() => setCurrentTab('villages')}
            style={{ padding: "14px 28px", background: currentTab === 'villages' ? "#3b82f6" : "#f3f4f6", color: currentTab === 'villages' ? "white" : "#4b5563", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "500", transition: "all 0.3s", boxShadow: currentTab === 'villages' ? "0 2px 8px rgba(59, 130, 246, 0.3)" : "none" }}
          >
            Villages
          </button>
        </div>

        {/* Global Search */}
        <div style={{ background: "white", padding: "25px", marginBottom: "30px", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <h3 style={{ marginTop: 0, color: "#1a1a1a", fontSize: "20px", fontWeight: "600", marginBottom: "15px" }}>Search Location</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <input 
              type="text" 
              placeholder="Search for any district, taluka, or village..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              style={{ flex: 1, padding: "12px 16px", border: "2px solid #e5e7eb", borderRadius: "10px", fontSize: "16px", color: "#1a1a1a", background: "#f9fafb", outline: "none", transition: "all 0.3s" }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
            />
            <button 
              onClick={() => setGlobalSearch('')}
              style={{ padding: "12px 24px", background: "#ef4444", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "500", transition: "all 0.3s", boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#ef4444"}
            >
              Clear
            </button>
          </div>
          
          {searchResults && globalSearch && (
            <div style={{ marginTop: "20px" }}>
              <h4>Search Results:</h4>
              <div>
                {searchResults.districtResults.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <h5 style={{ color: "#4b5563", fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}>Districts:</h5>
                    {searchResults.districtResults.map(d => (
                      <div key={d.code} style={{ padding: "10px 15px", background: "#f3f4f6", margin: "8px 0", borderRadius: "8px", color: "#1a1a1a", fontSize: "15px", border: "1px solid #e5e7eb" }}>
                        <strong>{d.name}</strong> <span style={{ color: "#6b7280" }}>({d.code})</span>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.talukaResults.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <h5 style={{ color: "#4b5563", fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}>Talukas:</h5>
                    {searchResults.talukaResults.map(t => (
                      <div key={t.code} style={{ padding: "10px 15px", background: "#f3f4f6", margin: "8px 0", borderRadius: "8px", color: "#1a1a1a", fontSize: "15px", border: "1px solid #e5e7eb" }}>
                        <strong>{t.name}</strong> <span style={{ color: "#6b7280" }}>({t.code})</span>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.villageResults.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <h5 style={{ color: "#4b5563", fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}>Villages:</h5>
                    {searchResults.villageResults.map(v => (
                      <div key={v.code} style={{ padding: "10px 15px", background: "#f3f4f6", margin: "8px 0", borderRadius: "8px", color: "#1a1a1a", fontSize: "15px", border: "1px solid #e5e7eb" }}>
                        <strong>{v.name}</strong> <span style={{ color: "#6b7280" }}>({v.code})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ background: "white", padding: "35px", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <div style={{ display: "inline-block", width: "50px", height: "50px", border: "4px solid #f3f4f6", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
              <p style={{ marginTop: "20px", color: "#6b7280", fontSize: "16px" }}>Loading masters data...</p>
            </div>
          ) : (
            <>
              {/* Districts Tab */}
              {currentTab === 'districts' && (
                <div>
                  <div style={{ marginBottom: "35px", padding: "30px", background: "#f9fafb", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                    <h3 style={{ marginTop: 0, color: "#1a1a1a", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>Add New District</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "25px" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>District Name</label>
                        <input 
                          type="text" 
                          placeholder="Enter district name"
                          value={districtForm.name}
                          onChange={(e) => setDistrictForm({ ...districtForm, name: e.target.value })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>District Code</label>
                        <input 
                          type="text" 
                          placeholder="Enter district code"
                          maxLength={3}
                          value={districtForm.code}
                          onChange={(e) => setDistrictForm({ ...districtForm, code: e.target.value })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>Status</label>
                        <select 
                          value={districtForm.active.toString()}
                          onChange={(e) => setDistrictForm({ ...districtForm, active: e.target.value === 'true' })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s", cursor: "pointer" }}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={saveDistrict}
                      style={{ background: "#10b981", color: "white", padding: "12px 28px", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "500", transition: "all 0.3s", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#059669"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#10b981"}
                    >
                      Add District
                    </button>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                      <h3 style={{ margin: 0, color: "#1a1a1a", fontSize: "20px", fontWeight: "600" }}>Districts List</h3>
                      <input 
                        type="text" 
                        placeholder="Search districts..."
                        value={districtSearch}
                        onChange={(e) => setDistrictSearch(e.target.value)}
                        style={{ padding: "10px 16px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "15px", color: "#1a1a1a", background: "#f9fafb", outline: "none", transition: "all 0.3s", width: "250px" }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
                      />
                    </div>
                    
                    {filteredDistricts.length > 0 ? (
                      <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "8px", overflow: "hidden" }}>
                        <thead>
                          <tr style={{ background: "#f9fafb" }}>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Code</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>District Name</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Status</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDistricts.map(district => (
                            <tr key={district.code} style={{ transition: "all 0.2s", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                              <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", color: "#6b7280", fontSize: "15px", fontFamily: "monospace" }}>{district.code}</td>
                              <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", color: "#1a1a1a", fontSize: "15px", fontWeight: "500" }}>{district.name}</td>
                              <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>
                                <span style={{ 
                                  padding: "4px 12px", 
                                  borderRadius: "20px", 
                                  fontSize: "13px", 
                                  fontWeight: "500",
                                  background: district.active ? "#d1fae5" : "#fee2e2",
                                  color: district.active ? "#065f46" : "#991b1b"
                                }}>
                                  {district.active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>
                                <button 
                                  onClick={() => deleteDistrict(district.code)}
                                  style={{ padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500", transition: "all 0.3s" }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
                                  onMouseLeave={(e) => e.currentTarget.style.background = "#ef4444"}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ textAlign: "center", padding: "60px" }}>
                        <div style={{ marginBottom: "20px" }}>
                          <div style={{ width: "80px", height: "80px", margin: "0 auto", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Database style={{ width: "40px", height: "40px", color: "#9ca3af" }} />
                          </div>
                        </div>
                        <p style={{ color: "#6b7280", fontSize: "18px", fontWeight: "500", marginBottom: "8px" }}>No districts found</p>
                        <p style={{ color: "#9ca3af", fontSize: "15px" }}>Add your first district using the form above</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Talukas Tab */}
              {currentTab === 'talukas' && (
                <div>
                  <div style={{ marginBottom: "35px", padding: "30px", background: "#f9fafb", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                    <h3 style={{ marginTop: 0, color: "#1a1a1a", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>Add New Taluka</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "25px" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>Select District</label>
                        <select 
                          value={talukaForm.districtCode}
                          onChange={(e) => setTalukaForm({ ...talukaForm, districtCode: e.target.value })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s", cursor: "pointer" }}
                        >
                          <option value="">Select a district</option>
                          {districts.filter(d => d.active).map(district => (
                            <option key={district.code} value={district.code}>{district.name}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>Taluka Name</label>
                        <input 
                          type="text" 
                          placeholder="Enter taluka name"
                          value={talukaForm.name}
                          onChange={(e) => setTalukaForm({ ...talukaForm, name: e.target.value })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>Taluka Code</label>
                        <input 
                          type="text" 
                          placeholder="Enter taluka code"
                          maxLength={3}
                          value={talukaForm.code}
                          onChange={(e) => setTalukaForm({ ...talukaForm, code: e.target.value })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>Status</label>
                        <select 
                          value={talukaForm.active.toString()}
                          onChange={(e) => setTalukaForm({ ...talukaForm, active: e.target.value === 'true' })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s", cursor: "pointer" }}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={saveTaluka}
                      style={{ background: "#10b981", color: "white", padding: "12px 28px", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "500", transition: "all 0.3s", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#059669"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#10b981"}
                    >
                      Add Taluka
                    </button>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                      <h3 style={{ margin: 0, color: "#1a1a1a", fontSize: "20px", fontWeight: "600" }}>Talukas List</h3>
                      <input 
                        type="text" 
                        placeholder="Search talukas..."
                        value={talukaSearch}
                        onChange={(e) => setTalukaSearch(e.target.value)}
                        style={{ padding: "10px 16px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "15px", color: "#1a1a1a", background: "#f9fafb", outline: "none", transition: "all 0.3s", width: "250px" }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
                      />
                    </div>
                    
                    {filteredTalukas.length > 0 ? (
                      <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "8px", overflow: "hidden" }}>
                        <thead>
                          <tr style={{ background: "#f9fafb" }}>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Code</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Taluka Name</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>District</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Status</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTalukas.map(taluka => {
                            const district = districts.find(d => d.code === taluka.districtCode);
                            return (
                              <tr key={taluka.code} style={{ transition: "all 0.2s", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", color: "#6b7280", fontSize: "15px", fontFamily: "monospace" }}>{taluka.code}</td>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", color: "#1a1a1a", fontSize: "15px", fontWeight: "500" }}>{taluka.name}</td>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", color: "#4b5563", fontSize: "15px" }}>{district?.name || taluka.districtCode}</td>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>
                                  <span style={{ 
                                    padding: "4px 12px", 
                                    borderRadius: "20px", 
                                    fontSize: "13px", 
                                    fontWeight: "500",
                                    background: taluka.active ? "#d1fae5" : "#fee2e2",
                                    color: taluka.active ? "#065f46" : "#991b1b"
                                  }}>
                                    {taluka.active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>
                                  <button 
                                    onClick={() => deleteTaluka(taluka.code)}
                                    style={{ padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500", transition: "all 0.3s" }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "#ef4444"}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ textAlign: "center", padding: "60px" }}>
                        <div style={{ marginBottom: "20px" }}>
                          <div style={{ width: "80px", height: "80px", margin: "0 auto", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Database style={{ width: "40px", height: "40px", color: "#9ca3af" }} />
                          </div>
                        </div>
                        <p style={{ color: "#6b7280", fontSize: "18px", fontWeight: "500", marginBottom: "8px" }}>No talukas found</p>
                        <p style={{ color: "#9ca3af", fontSize: "15px" }}>Select a district and add your first taluka</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Villages Tab */}
              {currentTab === 'villages' && (
                <div>
                  <div style={{ marginBottom: "35px", padding: "30px", background: "#f9fafb", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                    <h3 style={{ marginTop: 0, color: "#1a1a1a", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>Add New Village</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "25px" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>Select District</label>
                        <select 
                          value={villageForm.districtCode}
                          onChange={(e) => {
                            setVillageForm({ ...villageForm, districtCode: e.target.value, talukaCode: '' });
                          }}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s", cursor: "pointer" }}
                        >
                          <option value="">Select a district</option>
                          {districts.filter(d => d.active).map(district => (
                            <option key={district.code} value={district.code}>{district.name}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>Select Taluka</label>
                        <select 
                          value={villageForm.talukaCode}
                          onChange={(e) => setVillageForm({ ...villageForm, talukaCode: e.target.value })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s", cursor: "pointer" }}
                        >
                          <option value="">First select a district</option>
                          {villageForm.districtCode && talukas.filter(t => t.districtCode === villageForm.districtCode && t.active).map(taluka => (
                            <option key={taluka.code} value={taluka.code}>{taluka.name}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>Village Name</label>
                        <input 
                          type="text" 
                          placeholder="Enter village name"
                          value={villageForm.name}
                          onChange={(e) => setVillageForm({ ...villageForm, name: e.target.value })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>Village Code</label>
                        <input 
                          type="text" 
                          placeholder="Enter village code"
                          maxLength={5}
                          value={villageForm.code}
                          onChange={(e) => setVillageForm({ ...villageForm, code: e.target.value })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>Pincode</label>
                        <input 
                          type="text" 
                          placeholder="Enter pincode"
                          maxLength={6}
                          value={villageForm.pincode}
                          onChange={(e) => setVillageForm({ ...villageForm, pincode: e.target.value })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "500", color: "#374151", fontSize: "15px" }}>Status</label>
                        <select 
                          value={villageForm.active.toString()}
                          onChange={(e) => setVillageForm({ ...villageForm, active: e.target.value === 'true' })}
                          style={{ padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", color: "#1a1a1a", background: "white", outline: "none", transition: "all 0.3s", cursor: "pointer" }}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={saveVillage}
                      style={{ background: "#10b981", color: "white", padding: "12px 28px", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "500", transition: "all 0.3s", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#059669"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#10b981"}
                    >
                      Add Village
                    </button>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                      <h3 style={{ margin: 0, color: "#1a1a1a", fontSize: "20px", fontWeight: "600" }}>Villages List</h3>
                      <input 
                        type="text" 
                        placeholder="Search villages..."
                        value={villageSearch}
                        onChange={(e) => setVillageSearch(e.target.value)}
                        style={{ padding: "10px 16px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "15px", color: "#1a1a1a", background: "#f9fafb", outline: "none", transition: "all 0.3s", width: "250px" }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
                      />
                    </div>
                    
                    {filteredVillages.length > 0 ? (
                      <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "8px", overflow: "hidden" }}>
                        <thead>
                          <tr style={{ background: "#f9fafb" }}>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Code</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Village Name</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>District</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Taluka</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Pincode</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Status</th>
                            <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "15px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVillages.map(village => {
                            const district = districts.find(d => d.code === village.districtCode);
                            const taluka = talukas.find(t => t.code === village.talukaCode);
                            return (
                              <tr key={village.code} style={{ transition: "all 0.2s", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", color: "#6b7280", fontSize: "15px", fontFamily: "monospace" }}>{village.code}</td>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", color: "#1a1a1a", fontSize: "15px", fontWeight: "500" }}>{village.name}</td>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", color: "#4b5563", fontSize: "15px" }}>{district?.name || village.districtCode}</td>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", color: "#4b5563", fontSize: "15px" }}>{taluka?.name || village.talukaCode}</td>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", color: "#6b7280", fontSize: "15px" }}>{village.pincode || '-'}</td>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>
                                  <span style={{ 
                                    padding: "4px 12px", 
                                    borderRadius: "20px", 
                                    fontSize: "13px", 
                                    fontWeight: "500",
                                    background: village.active ? "#d1fae5" : "#fee2e2",
                                    color: village.active ? "#065f46" : "#991b1b"
                                  }}>
                                    {village.active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>
                                  <button 
                                    onClick={() => deleteVillage(village.code)}
                                    style={{ padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500", transition: "all 0.3s" }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "#ef4444"}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ textAlign: "center", padding: "60px" }}>
                        <div style={{ marginBottom: "20px" }}>
                          <div style={{ width: "80px", height: "80px", margin: "0 auto", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Database style={{ width: "40px", height: "40px", color: "#9ca3af" }} />
                          </div>
                        </div>
                        <p style={{ color: "#6b7280", fontSize: "18px", fontWeight: "500", marginBottom: "8px" }}>No villages found</p>
                        <p style={{ color: "#9ca3af", fontSize: "15px" }}>Select a district and taluka, then add your first village</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}