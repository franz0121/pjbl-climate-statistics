// Service to manage student-class relationships
const STUDENT_CLASS_MAP_KEY = 'studentClassMap';

interface StudentClassMap {
  [username: string]: string; // username -> classId
}

export const getStudentClassMap = (): StudentClassMap => {
  const stored = localStorage.getItem(STUDENT_CLASS_MAP_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const saveStudentClassMap = (map: StudentClassMap) => {
  localStorage.setItem(STUDENT_CLASS_MAP_KEY, JSON.stringify(map));
};

export const registerStudentToClass = (username: string, classId: string) => {
  const map = getStudentClassMap();
  map[username] = classId;
  saveStudentClassMap(map);
};

export const getStudentClassId = (username: string): string | null => {
  const map = getStudentClassMap();
  return map[username] || null;
};

export const removeStudentFromMap = (username: string) => {
  const map = getStudentClassMap();
  delete map[username];
  saveStudentClassMap(map);
};

export const deleteClassAndStudents = (_classId: string, studentUsernames: string[]) => {
  // Remove all students in this class from the map
  const map = getStudentClassMap();
  studentUsernames.forEach(username => {
    delete map[username];
  });
  saveStudentClassMap(map);
};

