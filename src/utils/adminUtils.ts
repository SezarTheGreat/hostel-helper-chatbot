
import { getCurrentStudent, createAdminUser, getStudents } from "@/services/storageService";

/**
 * Creates an admin user if none exists and sets up a login link
 * This is a convenience function for hackathon/demo purposes only
 */
export const setupAdminUser = () => {
  // Create admin user if it doesn't exist
  const adminUser = createAdminUser();
  
  // For demo/hackathon purposes, we'll log the admin credentials
  console.log('Admin user created/found with ID:', adminUser.id);
  console.log('Use the admin login to access the admin dashboard');
};

/**
 * Check if the current user is an admin
 */
export const isCurrentUserAdmin = (): boolean => {
  const currentStudent = getCurrentStudent();
  return Boolean(currentStudent?.isAdmin);
};

/**
 * Get admin login info for demo purposes (only for hackathon)
 */
export const getAdminLoginInfo = () => {
  const students = getStudents();
  const admin = students.find(s => s.isAdmin);
  
  if (admin) {
    return {
      email: admin.email,
      name: admin.name,
      id: admin.id
    };
  }
  
  return null;
};
