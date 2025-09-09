"use client";

import { useEffect, useState, useCallback } from 'react';
import { getMastersData, getDistrictTalukas, getTalukaVillages } from '@/services/masters';
import type { District, Taluka, Village } from '@/types';

export function useMasters() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [talukas, setTalukas] = useState<Taluka[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [talukasLoading, setTalukasLoading] = useState(false);
  const [villagesLoading, setVillagesLoading] = useState(false);

  useEffect(() => {
    async function fetchMasters() {
      try {
        const data = await getMastersData();
        setDistricts(data.districts);
      } catch (error) {
        console.error('Error loading masters:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMasters();
  }, []);

  const loadTalukas = useCallback(async (districtCode: string) => {
    if (!districtCode) return;
    
    try {
      setTalukasLoading(true);
      const talukaData = await getDistrictTalukas(districtCode);
      setTalukas(talukaData || []);
      // Clear villages when district changes
      setVillages([]);
    } catch (error) {
      console.error('Error loading talukas:', error);
      setTalukas([]);
      setVillages([]);
    } finally {
      setTalukasLoading(false);
    }
  }, []);

  const loadVillages = useCallback(async (talukaCode: string) => {
    if (!talukaCode) return;
    
    try {
      setVillagesLoading(true);
      const villageData = await getTalukaVillages(talukaCode);
      setVillages(villageData || []);
    } catch (error) {
      console.error('Error loading villages:', error);
      setVillages([]);
    } finally {
      setVillagesLoading(false);
    }
  }, []);

  return {
    districts,
    talukas,
    villages,
    loading,
    talukasLoading,
    villagesLoading,
    loadTalukas,
    loadVillages,
  };
}

export function useFilteredMasters(districtCode?: string, talukaCode?: string) {
  const [filteredTalukas, setFilteredTalukas] = useState<Taluka[]>([]);
  const [filteredVillages, setFilteredVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function filterData() {
      if (districtCode) {
        setLoading(true);
        const talukas = await getDistrictTalukas(districtCode);
        setFilteredTalukas(talukas);
        setLoading(false);
      } else {
        setFilteredTalukas([]);
      }
    }

    filterData();
  }, [districtCode]);

  useEffect(() => {
    async function filterData() {
      if (talukaCode) {
        setLoading(true);
        const villages = await getTalukaVillages(talukaCode);
        setFilteredVillages(villages);
        setLoading(false);
      } else {
        setFilteredVillages([]);
      }
    }

    filterData();
  }, [talukaCode]);

  return {
    filteredTalukas,
    filteredVillages,
    loading,
  };
}