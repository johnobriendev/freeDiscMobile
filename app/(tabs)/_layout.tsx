import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rounds"
        options={{
          title: 'Rounds',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="golf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}


// import React from 'react';
// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';

// export default function TabLayout() {
//   return (
//     <Tabs>
//       <Tabs.Screen
//         name="courses"
//         options={{
//           title: 'Courses',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="flag-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="rounds"
//         options={{
//           title: 'Rounds',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="golf-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="stats"
//         options={{
//           title: 'Statistics',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="bar-chart-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person-outline" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }



