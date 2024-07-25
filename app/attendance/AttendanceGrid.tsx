'use client';

import { useEffect, useState } from 'react';
import { collection, doc, getDocs, setDoc, addDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseconfig';
import { onAuthStateChanged } from 'firebase/auth';
import classNames from 'classnames';
import { useRouter } from 'next/router';

interface Student {
  id: string;
  name: string;
  attendance: string[];
}

const AttendanceGrid = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [user, setUser] = useState<any>(null);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.email === 'prasantshukla89@gmail.com') {
      const fetchStudents = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'students'));
          const studentsData: Student[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as Omit<Student, 'id'>;
            studentsData.push({ id: doc.id, ...data });
          });
          setStudents(studentsData);
          
        } catch (error) {
          console.error("Error fetching students: ", error);
        }
      };

      fetchStudents();
    }
  }, [user]);

  const handleAttendanceChange = async (studentId: string, dayIndex: number, status: string) => {
    if (user?.email !== 'prasantshukla89@gmail.com') {
      console.error("Unauthorized user attempt");
      return;
    }

    const updatedStudents = students.map(student =>
      student.id === studentId
        ? { ...student, attendance: student.attendance.map((s, i) => i === dayIndex ? status : s) }
        : student
    );
    setStudents(updatedStudents);

    const student = updatedStudents.find(student => student.id === studentId);
    if (student) {
      const studentRef = doc(db, 'students', studentId);
      await setDoc(studentRef, student);
    }
  };

  const calculatePercentage = (attendance: string[]) => {
    const totalDays = attendance.length;
    const presentDays = attendance.filter(day => day === 'P').length;
    return totalDays ? ((presentDays / totalDays) * 100).toFixed(2) : '0.00';
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim() === '') return;

    if (user?.email !== 'prasantshukla89@gmail.com') {
      console.error("Unauthorized user attempt");
      return;
    }

    const newStudent: Omit<Student, 'id'> = {
      name: newStudentName,
      attendance: Array(24).fill(""),
    };

    try {
      const docRef = await addDoc(collection(db, 'students'), newStudent);
      setStudents([...students, { id: docRef.id, ...newStudent }]);
      setNewStudentName('');
    } catch (error) {
      console.error("Error adding student: ", error);
    }
  };

  if (user?.email !== 'prasantshukla89@gmail.com') {
    return <div className="p-5 text-center text-red-600 font-bold">You are not authorized to view this page.</div>;
  }

  return (
    <div className="p-5 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Attendance Management System For DSA</h1>
      <form onSubmit={handleAddStudent} className="mb-6 flex justify-center items-center space-x-4">
        <input
          type="text"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          placeholder="Enter student name"
          className="border border-gray-300 rounded-lg p-3 shadow-md w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          Add Student
        </button>
      </form>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border p-3">Student Name</th>
              {Array.from({ length: 24 }, (_, i) => (
                <th key={i} className="border p-3 text-center">{i + 8}</th>
              ))}
              <th className="border p-3">Total (%)</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? students.map((student) => (
                <tr key={student.id}>
                <td className="border p-2 bg-gray-100">{student.name}</td>
                {student.attendance.map((status, dayIndex) => (
                    <td key={dayIndex} className="border p-2">
                    <div className="flex items-center justify-center">
                      <select
                        value={status}
                        onChange={(e) => handleAttendanceChange(student.id, dayIndex, e.target.value)}
                        className={classNames(
                            'w-16 p-1 text-center rounded',
                            {
                                'bg-green-300 text-green-800': status === 'P',
                                'bg-red-300 text-red-800': status === 'A',
                                'bg-gray-200 text-gray-800': status === '',
                              }
                        )}
                        style={{ minWidth: '3rem' }}
                      >
                            
                        <option value="">--</option>
                        <option value="P">P</option>
                        <option value="A">A</option>
                      </select>
                    </div>
                  </td>
                ))}
                <td className="border p-2 bg-gray-100 text-center">
                  {calculatePercentage(student.attendance)}%
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={26} className="border p-2 text-center">Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceGrid;
