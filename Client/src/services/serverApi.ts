import axios from '../utils/axios-customize';

export const callAllGetUsers = async (query: string) => {
  return await axios.get(`/api/v1/dashboard/user/get-all-users?${query}`);
};

export const callAddUser = async (
  email: string,
  password: string,
  fullName: string,
  role: string
) => {
  return axios.post(`/api/v1/dashboard/user/add-user`, {
    email,
    password,
    fullName,
    role,
  });
};

export const callUpdateUser = async (
  email: string,
  role: string,
  status: string,
  fullName: string,
  id: string
) => {
  return axios.put(`/api/v1/dashboard/user/update-user`, {
    email,
    fullName,
    role,
    status,
    id,
  });
};

export const callDeleteUser = async (id: string) => {
  return axios.delete(`/api/v1/dashboard/user/delete-user/${id}`);
};

export const callGetUserById = async (id: string) => {
  return axios.get(`/api/v1/dashboard/user/get-user/${id}`);
};

export const callAddNewEmployee = async ( emails: string, salary: string, jobTitle: string) => {
  return axios.post(`/api/v1/dashboard/employee/add-new-employee`, {
    emails,
    salary,
    jobTitle,
  });
};

export const callGetAllEmployee = async (query: string) => {
  return axios.get(`/api/v1/dashboard/employee/get-all-employees?${query}`);
};

export const callDeleteEmployee = async (employeeId: string) => {
  return axios.delete(`/api/v1/dashboard/employee/delete-employee/${employeeId}`);
};

export const callUpdateEmployee = async (employeeId: string, employeeName: string, salary: string, jobTitle: string) => {
  return axios.put(`/api/v1/dashboard/employee/update-employee`, {
    employeeId,
    employeeName,
    salary,
    jobTitle,
  });
};``

export const callGetAllUser = async () => {
  return axios.get(`/api/v1/dashboard/employee/get-emails-user`);
};

export const callGetAllEmployees = async () => {
  return axios.get(`/api/v1/dashboard/employee/get-emails-employee`);
};

export const callGetAllShift = async (query: string) => {
  return axios.get(`/api/v1/dashboard/shift/get-all-shifts?${query}`);
};

export const callAddNewShift = async (shiftName: string, startTime: string, endTime: string) => {
  return axios.post(`/api/v1/dashboard/shift/add-new-shift`, {
    shiftName,
    startTime,
    endTime,
  });
};

export const callUpdateShift = async (shiftId: string, shiftName: string, startTime: string, endTime: string) => {
  return axios.put(`/api/v1/dashboard/shift/update-shift`, {
    shiftId,
    shiftName,
    startTime,
    endTime,
  });
};

export const callDeleteShift = async (id : string) => {
  return axios.delete(`/api/v1/dashboard/shift/delete-shift/${id}`);
};


export const callGetAllEmployeeShift = async (query: string) => {
  return axios.get(`/api/v1/dashboard/employee-shift/get-all-employee-shifts?${query}`);
};


export const callAddNewEmployeeShift = async (employeeIds: [], shiftId: string, startDate: string, endDate: string) => {
  return axios.post(`/api/v1/dashboard/employee-shift/add-employee-to-shift`, {
    employeeIds,
    shiftId,
    startDate,
    endDate,
  });
};

export const callUpdateEmployeeShift = async (employeeIds: string, shiftId: string, workDate: string, newWorkDate: string) => {
  return axios.put(`/api/v1/dashboard/employee-shift/update-employee-shift`, {
    employeeIds,
    shiftId,
    workDate,
    newWorkDate,
  });
};

export const callDeleteEmployeeShift = async (employeeId: string, shiftId: string, workDate: string) => {
  return axios.delete(`/api/v1/dashboard/employee-shift/remove-employee-from-shift?employeeId=${employeeId}&shiftId=${shiftId}&workDate=${workDate}`);
};

export const callGetAllAttendanceManagement = async (query: string) => {
  return axios.get(`/api/v1/dashboard/attendance/get-attendance-by-date?${query}`);
};

export const callUpdateAttendanceManagement = async (id: string, status: string, note: string) => {
  return axios.put(`/api/v1/dashboard/attendance/update-status`, {
    id,
    status,
    note,
  });
};

/// statistical Management

export const callGetCountHoursWork = async (month: string, year: string) => {
  return axios.get(`/api/v1/dashboard/employee-shift/count-hours-worked?month=${month}&year=${year}`);
};

export const callGetCountEmployeeShift = async (month: string, year: string) => {
  return axios.get(`/api/v1/dashboard/employee-shift/count-employee-shifts?month=${month}&year=${year}`);
};

export const callGetSumStatusPerMonth = async (month: string, year: string, status: string) => {
  return axios.get(`/api/v1/dashboard/attendance/sum-status-per-month?month=${month}&year=${year}&status=${status}`);
};

export const callGetSumSalaryPerMonth = async (month: string, year: string) => {
  return axios.get(`/api/v1/dashboard/attendance/sum-salary-per-month?month=${month}&year=${year}`);
};

export const callGetSumSalaryOfEmployeePerMonth = async (employeeId: string, month: string, year: string) => {
  return axios.get(`/api/v1/dashboard/attendance/sum-salary-of-employee-per-month?employeeId=${employeeId}&month=${month}&year=${year}`);
};

export const callGetCountEmployeePerMonth = async (month: string, year: string) => {
  return axios.get(`/api/v1/dashboard/employee/count-employees?month=${month}&year=${year}`);
}
/// category

export const callGetAllCategory = async (query: string) => {
  return axios.get(`/api/v1/dashboard/category/get-all-categories?${query}`);
};

export const callGetAllCategoriesName = async () => {
  return axios.get(`/api/v1/dashboard/category/get-all-categories-name`);
}

export const callAddNewCategory = async (name: string, slug: string, status: string, parentId: string | null, description: string, subCategories: Array<{ name: string; description: string; status: string }>) => {
  return axios.post(`/api/v1/dashboard/category/add-new-category`, {
    id: '',
    name,
    slug,
    status,
    description,
    subCategories, 
  });
};

export const callUpdateCategory = async (payload: {
  id: string;
  name: string;
  slug: string;
  status: string;
  description: string;
  subCategories: {
    id?: string;
    name: string;
    slug: string;
    status: string;
    description: string;
  }[];
}) => {
  return axios.put(`/api/v1/dashboard/category/update-category`, payload);
};


export const callDeleteCategory = async (id: string) => {
  return axios.delete(`/api/v1/dashboard/category/delete-category/${id}`);
};

// warehouse 

export const callGetAllWarehouse = async (query: string) => {
  return axios.get(`/api/v1/dashboard/warehouses/get-all-ingredients?${query}`);
};

export const callAddNewWarehouse = async (
  ingredientName: string,
  importedQuantity: number,
  unit: string,
  importedDate: string,
  expiredDate: string,
  importedPrice: number,
  description: string,
  supplierName: string,
  categoryId: string
) => {
  return axios.post(`/api/v1/dashboard/warehouses/add-new-ingredient`, {
    ingredientName,
    importedQuantity,
    unit,
    importedDate,
    expiredDate,
    importedPrice,
    description,
    supplierName,
    categoryId
  });
};

export const callUpdateWarehouse = async (
  warehouseId: string,
  ingredientName: string,
  importedQuantity: number,
  unit: string,
  importedDate: string,
  expiredDate: string,
  importedPrice: number,
  description: string,
  supplierName: string,
  categoryId: string) => {
  return axios.put(`/api/v1/dashboard/warehouses/update-ingredient`, {
    warehouseId,
    ingredientName,
    importedQuantity,
    unit,
    importedDate,
    expiredDate,
    importedPrice,
    description,
    supplierName,
    categoryId
  });
};

export const callDeleteWarehouse = async (id: string) => {
  return axios.delete(`/api/v1/dashboard/warehouses/delete-ingredient/${id}`);
};


export const callImportExcelWarehouse = async (file: FormData) => {
  return axios.post(`/api/v1/dashboard/warehouses/import-ingredients-from-excel`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const callGetAllDishOptionGroup = async (query: string) => {
  return axios.get(`/api/v1/dashboard/dish-option-group/get-all-dish-option-groups?${query}`);
};

export const callAddNewDishOptionGroup = async (groupName: string, description: string, options: []) => {
  return axios.post(`/api/v1/dashboard/dish-option-group/add-dish-option-group`, { groupName, description, options });
};

export const callUpdateDishOptionGroup = async (groupId: string, groupName: string, description: string, options: []) => {
  return axios.put(`/api/v1/dashboard/dish-option-group/update-dish-option-group/${groupId}`, { groupName, description, options });
};

export const callDeleteDishOptionGroup = async (groupId: string) => {
  return axios.delete(`/api/v1/dashboard/dish-option-group/delete-dish-option-group/${groupId}`);
};

export const callDeleteDishOption = async (optionId: string) => {
  return axios.delete(`/api/v1/dashboard/dish-option-group/delete-dish-option/${optionId}`);
};

export const callGetAllDishes = async (query: string) => {
  return axios.get(`/api/v1/dashboard/dish/get-all-dishes?${query}`);
};

export const callDeleteDish = async (id: string) => {
  return axios.delete(`/api/v1/dashboard/dish/delete-dish/${id}`);
};

export const callGetDishById = async (id: string) => {
  return axios.get(`/api/v1/dashboard/dish/get-dish-by-id/${id}`);
};


export const callAddNewDish = async (formData: FormData) => {
  try {
    const response = await axios.post(`/api/v1/dashboard/dish/add-new-dish`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error in callAddNewDish:', error);
    throw error;
  }
};

export const callGetAllIngredients = async () => {
  return axios.get(`/api/v1/dashboard/warehouses/get-all-ingredients-name`);
}

export const callGetAllOptionSelections = async () => {
  return axios.get(`/api/v1/dashboard/dish-option-group/get-all-option-name`);
}

export const callUpdateDish = async (formData: FormData) => {
  try {
    const response = await axios.put(`/api/v1/dashboard/dish/update-dish`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error in callAddNewDish:', error);
    throw error;
  }};

export const callDeleteDishImageOther = async (dishImageId: string) => {
  return axios.delete(`/api/v1/dashboard/dish/image/${dishImageId}`);
};

export const callGetAllCoupon = async (query: string) => {
  return axios.get(`/api/v1/dashboard/coupon/get-all-coupons?${query}`);
};

export const callAddNewCoupon = async (code: string, discountPercent: number, minOrderValue: number, maxDiscount: string, description: string, maxUsage: string, startDate: string, expirationDate: string) => {
  return axios.post(`/api/v1/dashboard/coupon/add-new-coupon`, { code, discountPercent, minOrderValue, maxDiscount, description, maxUsage, startDate, expirationDate });
};

export const callGetCouponByCode = async (code: string) => {
  return axios.get(`/api/v1/dashboard/coupon/get-coupon/{code}?code=${code}`);
};
