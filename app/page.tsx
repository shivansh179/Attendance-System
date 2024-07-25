// app/page.tsx

import AttendanceGrid from "./attendance/AttendanceGrid";

 
export default function Home() {
  return (
    <div className="container mx-auto p-5">
      <AttendanceGrid />
    </div>
  );
}
