import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

type LocationType = 'cities' | 'states' | 'communes';

interface UseLocationFetcherProps {
  selectedCity?: string;
  selectedState?: string;
}

const endpoints = {
  cities: 'https://api.mysupership.vn/v1/partner/areas/province',
  states: (provinceCode: string) =>
    `https://api.mysupership.vn/v1/partner/areas/district?province=${provinceCode}`,
  communes: (districtCode: string) =>
    `https://api.mysupership.vn/v1/partner/areas/commune?district=${districtCode}`,
};

const useLocationFetcher = ({
  selectedCity,
  selectedState,
}: UseLocationFetcherProps) => {
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [communes, setCommunes] = useState<string[]>([]);

  // Hàm fetch dữ liệu
  const fetchLocations = useCallback(
    async (type: LocationType, parentCode?: string) => {
      const url =
        type === 'states' || type === 'communes'
          ? endpoints[type](parentCode || '')
          : endpoints[type];

      try {
        const response = await axios.get(url);
        return response.data.results || [];
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        return [];
      }
    },
    []
  );

  // Fetch cities khi component mount
  useEffect(() => {
    fetchLocations('cities').then((data) => {
      if (Array.isArray(data)) setCities(data);
    });
  }, [fetchLocations]);

  // Fetch states khi selectedCity thay đổi
  useEffect(() => {
    if (selectedCity) {
      fetchLocations('states', selectedCity).then((data) => {
        if (Array.isArray(data)) setStates(data);
      });
      setCommunes([]); // Reset communes khi selectedCity thay đổi
    }
  }, [selectedCity, fetchLocations]);

  // Fetch communes khi selectedState thay đổi
  useEffect(() => {
    if (selectedState) {
      fetchLocations('communes', selectedState).then((data) => {
        if (Array.isArray(data)) setCommunes(data);
      });
    }
  }, [selectedState, fetchLocations]);

  return { cities, states, communes, setCities, setStates, setCommunes };
};

export default useLocationFetcher;
