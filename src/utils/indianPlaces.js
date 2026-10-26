/**
 * AstroVeda - Comprehensive Indian Places Database
 * Contains major cities, sacred pilgrimage centers (Tirthas), district capitals,
 * across all 28 States and 8 Union Territories with precise Latitude & Longitude.
 * Timezone for all Indian locations is standard IST (+5.5 UTC).
 */

export const INDIAN_PLACES = [
  // --- National Capital Region & Delhi ---
  { name: 'New Delhi, Delhi', state: 'Delhi', lat: 28.6139, lon: 77.2090, tz: 5.5 },
  { name: 'Delhi (Old / Chandni Chowk)', state: 'Delhi', lat: 28.6506, lon: 77.2303, tz: 5.5 },
  { name: 'Noida, Uttar Pradesh', state: 'Uttar Pradesh', lat: 28.5355, lon: 77.3910, tz: 5.5 },
  { name: 'Greater Noida, Uttar Pradesh', state: 'Uttar Pradesh', lat: 28.4744, lon: 77.5040, tz: 5.5 },
  { name: 'Gurugram (Gurgaon), Haryana', state: 'Haryana', lat: 28.4595, lon: 77.0266, tz: 5.5 },
  { name: 'Faridabad, Haryana', state: 'Haryana', lat: 28.4089, lon: 77.3178, tz: 5.5 },
  { name: 'Ghaziabad, Uttar Pradesh', state: 'Uttar Pradesh', lat: 28.6692, lon: 77.4538, tz: 5.5 },

  // --- Sacred Vedic Tirthas & Pilgrimage Sites ---
  { name: 'Varanasi (Kashi / Banaras), UP', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: 'Ayodhya (Ram Janmabhoomi), UP', state: 'Uttar Pradesh', lat: 26.7922, lon: 82.1998, tz: 5.5 },
  { name: 'Mathura (Krishna Janmabhoomi), UP', state: 'Uttar Pradesh', lat: 27.4924, lon: 77.6737, tz: 5.5 },
  { name: 'Vrindavan, Uttar Pradesh', state: 'Uttar Pradesh', lat: 27.5806, lon: 77.7006, tz: 5.5 },
  { name: 'Haridwar (Maya Puri), Uttarakhand', state: 'Uttarakhand', lat: 29.9457, lon: 78.1642, tz: 5.5 },
  { name: 'Rishikesh, Uttarakhand', state: 'Uttarakhand', lat: 30.0869, lon: 78.2676, tz: 5.5 },
  { name: 'Kedarnath Dham, Uttarakhand', state: 'Uttarakhand', lat: 30.7352, lon: 79.0669, tz: 5.5 },
  { name: 'Badrinath Dham, Uttarakhand', state: 'Uttarakhand', lat: 30.7433, lon: 79.4938, tz: 5.5 },
  { name: 'Ujjain (Mahakaleshwar / Avantika), MP', state: 'Madhya Pradesh', lat: 23.1765, lon: 75.7885, tz: 5.5 },
  { name: 'Prayagraj (Allahabad / Triveni Sangam), UP', state: 'Uttar Pradesh', lat: 25.4358, lon: 81.8463, tz: 5.5 },
  { name: 'Puri (Jagannath Dham), Odisha', state: 'Odisha', lat: 19.8135, lon: 85.8312, tz: 5.5 },
  { name: 'Rameswaram Dham, Tamil Nadu', state: 'Tamil Nadu', lat: 9.2876, lon: 79.3129, tz: 5.5 },
  { name: 'Dwarka Dham, Gujarat', state: 'Gujarat', lat: 22.2442, lon: 68.9685, tz: 5.5 },
  { name: 'Somnath (Jyotirlinga), Gujarat', state: 'Gujarat', lat: 20.8880, lon: 70.4012, tz: 5.5 },
  { name: 'Tirupati (Balaji / Venkateswara), AP', state: 'Andhra Pradesh', lat: 13.6288, lon: 79.4192, tz: 5.5 },
  { name: 'Madurai (Meenakshi Amman), TN', state: 'Tamil Nadu', lat: 9.9252, lon: 78.1198, tz: 5.5 },
  { name: 'Shirdi (Sai Baba), Maharashtra', state: 'Maharashtra', lat: 19.7667, lon: 74.4762, tz: 5.5 },
  { name: 'Trimbakeshwar (Jyotirlinga), Maharashtra', state: 'Maharashtra', lat: 19.9324, lon: 73.5309, tz: 5.5 },
  { name: 'Gaya (Vishnupad / Pind Daan), Bihar', state: 'Bihar', lat: 24.7914, lon: 85.0002, tz: 5.5 },
  { name: 'Bodh Gaya (Mahabodhi), Bihar', state: 'Bihar', lat: 24.6961, lon: 84.9869, tz: 5.5 },
  { name: 'Pushkar (Brahma Temple), Rajasthan', state: 'Rajasthan', lat: 26.4897, lon: 74.5511, tz: 5.5 },
  { name: 'Kurukshetra (Bhagavad Gita Bhoomi), Haryana', state: 'Haryana', lat: 29.9695, lon: 76.8783, tz: 5.5 },
  { name: 'Kanchipuram, Tamil Nadu', state: 'Tamil Nadu', lat: 12.8342, lon: 79.7036, tz: 5.5 },
  { name: 'Thanjavur (Brihadisvara), Tamil Nadu', state: 'Tamil Nadu', lat: 10.7870, lon: 79.1378, tz: 5.5 },
  { name: 'Amritsar (Golden Temple), Punjab', state: 'Punjab', lat: 31.6340, lon: 74.8723, tz: 5.5 },
  { name: 'Udupi (Sri Krishna Matha), Karnataka', state: 'Karnataka', lat: 13.3409, lon: 74.7421, tz: 5.5 },
  { name: 'Sringeri (Sharada Peetham), Karnataka', state: 'Karnataka', lat: 13.4192, lon: 75.2567, tz: 5.5 },
  { name: 'Kollur (Mookambika), Karnataka', state: 'Karnataka', lat: 13.8647, lon: 74.8142, tz: 5.5 },
  { name: 'Dharmasthala (Manjunatha), Karnataka', state: 'Karnataka', lat: 12.9567, lon: 75.3800, tz: 5.5 },
  { name: 'Gokarna (Mahabaleshwar), Karnataka', state: 'Karnataka', lat: 14.5479, lon: 74.3188, tz: 5.5 },
  { name: 'Kukke Subramanya, Karnataka', state: 'Karnataka', lat: 12.6631, lon: 75.6148, tz: 5.5 },
  { name: 'Guruvayur, Kerala', state: 'Kerala', lat: 10.5946, lon: 76.0407, tz: 5.5 },
  { name: 'Sabarimala, Kerala', state: 'Kerala', lat: 9.4402, lon: 77.0819, tz: 5.5 },

  // --- Maharashtra ---
  { name: 'Mumbai, Maharashtra', state: 'Maharashtra', lat: 19.0760, lon: 72.8777, tz: 5.5 },
  { name: 'Pune, Maharashtra', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, tz: 5.5 },
  { name: 'Nagpur, Maharashtra', state: 'Maharashtra', lat: 21.1458, lon: 79.0882, tz: 5.5 },
  { name: 'Nashik, Maharashtra', state: 'Maharashtra', lat: 19.9975, lon: 73.7898, tz: 5.5 },
  { name: 'Chhatrapati Sambhajinagar (Aurangabad)', state: 'Maharashtra', lat: 19.8762, lon: 75.3433, tz: 5.5 },
  { name: 'Thane, Maharashtra', state: 'Maharashtra', lat: 19.2183, lon: 72.9781, tz: 5.5 },
  { name: 'Navi Mumbai, Maharashtra', state: 'Maharashtra', lat: 19.0330, lon: 73.0297, tz: 5.5 },
  { name: 'Solapur, Maharashtra', state: 'Maharashtra', lat: 17.6599, lon: 75.9064, tz: 5.5 },
  { name: 'Kolhapur, Maharashtra', state: 'Maharashtra', lat: 16.7050, lon: 74.2433, tz: 5.5 },
  { name: 'Amravati, Maharashtra', state: 'Maharashtra', lat: 20.9374, lon: 77.7796, tz: 5.5 },
  { name: 'Nanded, Maharashtra', state: 'Maharashtra', lat: 19.1383, lon: 77.3210, tz: 5.5 },
  { name: 'Jalgaon, Maharashtra', state: 'Maharashtra', lat: 21.0077, lon: 75.5626, tz: 5.5 },
  { name: 'Akola, Maharashtra', state: 'Maharashtra', lat: 20.7002, lon: 77.0082, tz: 5.5 },
  { name: 'Latur, Maharashtra', state: 'Maharashtra', lat: 18.4088, lon: 76.5604, tz: 5.5 },
  { name: 'Dhule, Maharashtra', state: 'Maharashtra', lat: 20.9042, lon: 74.7749, tz: 5.5 },
  { name: 'Ahmednagar (Ahilyanagar)', state: 'Maharashtra', lat: 19.0952, lon: 74.7496, tz: 5.5 },
  { name: 'Chandrapur, Maharashtra', state: 'Maharashtra', lat: 19.9615, lon: 79.2961, tz: 5.5 },
  { name: 'Sangli, Maharashtra', state: 'Maharashtra', lat: 16.8524, lon: 74.5815, tz: 5.5 },
  { name: 'Ratnagiri, Maharashtra', state: 'Maharashtra', lat: 16.9902, lon: 73.3120, tz: 5.5 },

  // --- Karnataka ---
  { name: 'Bengaluru (Bangalore), Karnataka', state: 'Karnataka', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: 'Mysuru (Mysore), Karnataka', state: 'Karnataka', lat: 12.2958, lon: 76.6394, tz: 5.5 },
  { name: 'Hubballi-Dharwad, Karnataka', state: 'Karnataka', lat: 15.3647, lon: 75.1240, tz: 5.5 },
  { name: 'Mangaluru (Mangalore), Karnataka', state: 'Karnataka', lat: 12.9141, lon: 74.8560, tz: 5.5 },
  { name: 'Belagavi (Belgaum), Karnataka', state: 'Karnataka', lat: 15.8497, lon: 74.4977, tz: 5.5 },
  { name: 'Kalaburagi (Gulbarga), Karnataka', state: 'Karnataka', lat: 17.3297, lon: 76.8343, tz: 5.5 },
  { name: 'Davanagere, Karnataka', state: 'Karnataka', lat: 14.4644, lon: 75.9218, tz: 5.5 },
  { name: 'Ballari (Bellary), Karnataka', state: 'Karnataka', lat: 15.1394, lon: 76.9214, tz: 5.5 },
  { name: 'Shivamogga (Shimoga), Karnataka', state: 'Karnataka', lat: 13.9299, lon: 75.5681, tz: 5.5 },
  { name: 'Tumakuru (Tumkur), Karnataka', state: 'Karnataka', lat: 13.3379, lon: 77.1173, tz: 5.5 },
  { name: 'Raichur, Karnataka', state: 'Karnataka', lat: 16.2120, lon: 77.3439, tz: 5.5 },
  { name: 'Bidar, Karnataka', state: 'Karnataka', lat: 17.9104, lon: 77.5199, tz: 5.5 },
  { name: 'Hospet (Vijayanagara), Karnataka', state: 'Karnataka', lat: 15.2689, lon: 76.3909, tz: 5.5 },
  { name: 'Hassan, Karnataka', state: 'Karnataka', lat: 13.0033, lon: 76.1004, tz: 5.5 },
  { name: 'Chikkamagaluru, Karnataka', state: 'Karnataka', lat: 13.3153, lon: 75.7754, tz: 5.5 },
  { name: 'Mandya, Karnataka', state: 'Karnataka', lat: 12.5238, lon: 76.8971, tz: 5.5 },
  { name: 'Bagalkot, Karnataka', state: 'Karnataka', lat: 16.1691, lon: 75.6615, tz: 5.5 },
  { name: 'Vijayapura (Bijapur), Karnataka', state: 'Karnataka', lat: 16.8302, lon: 75.7100, tz: 5.5 },
  { name: 'Chitradurga, Karnataka', state: 'Karnataka', lat: 14.2251, lon: 76.3980, tz: 5.5 },
  { name: 'Kolar, Karnataka', state: 'Karnataka', lat: 13.1367, lon: 78.1291, tz: 5.5 },

  // --- Tamil Nadu ---
  { name: 'Chennai (Madras), Tamil Nadu', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: 'Coimbatore, Tamil Nadu', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, tz: 5.5 },
  { name: 'Tiruchirappalli (Trichy), TN', state: 'Tamil Nadu', lat: 10.7905, lon: 78.7047, tz: 5.5 },
  { name: 'Salem, Tamil Nadu', state: 'Tamil Nadu', lat: 11.6643, lon: 78.1460, tz: 5.5 },
  { name: 'Tirunelveli, Tamil Nadu', state: 'Tamil Nadu', lat: 8.7139, lon: 77.7567, tz: 5.5 },
  { name: 'Tiruppur, Tamil Nadu', state: 'Tamil Nadu', lat: 11.1085, lon: 77.3411, tz: 5.5 },
  { name: 'Erode, Tamil Nadu', state: 'Tamil Nadu', lat: 11.3410, lon: 77.7172, tz: 5.5 },
  { name: 'Vellore, Tamil Nadu', state: 'Tamil Nadu', lat: 12.9165, lon: 79.1325, tz: 5.5 },
  { name: 'Thoothukudi (Tuticorin), TN', state: 'Tamil Nadu', lat: 8.7642, lon: 78.1348, tz: 5.5 },
  { name: 'Dindigul, Tamil Nadu', state: 'Tamil Nadu', lat: 10.3673, lon: 77.9803, tz: 5.5 },
  { name: 'Cuddalore, Tamil Nadu', state: 'Tamil Nadu', lat: 11.7480, lon: 79.7714, tz: 5.5 },
  { name: 'Kanyakumari, Tamil Nadu', state: 'Tamil Nadu', lat: 8.0883, lon: 77.5385, tz: 5.5 },
  { name: 'Nagercoil, Tamil Nadu', state: 'Tamil Nadu', lat: 8.1833, lon: 77.4119, tz: 5.5 },
  { name: 'Thiruvarur, Tamil Nadu', state: 'Tamil Nadu', lat: 10.7725, lon: 79.6365, tz: 5.5 },
  { name: 'Kumbakonam, Tamil Nadu', state: 'Tamil Nadu', lat: 10.9602, lon: 79.3845, tz: 5.5 },

  // --- Telangana ---
  { name: 'Hyderabad, Telangana', state: 'Telangana', lat: 17.3850, lon: 78.4867, tz: 5.5 },
  { name: 'Warangal, Telangana', state: 'Telangana', lat: 17.9689, lon: 79.5941, tz: 5.5 },
  { name: 'Nizamabad, Telangana', state: 'Telangana', lat: 18.6725, lon: 78.0941, tz: 5.5 },
  { name: 'Karimnagar, Telangana', state: 'Telangana', lat: 18.4386, lon: 79.1288, tz: 5.5 },
  { name: 'Khammam, Telangana', state: 'Telangana', lat: 17.2473, lon: 80.1514, tz: 5.5 },
  { name: 'Ramagundam, Telangana', state: 'Telangana', lat: 18.7551, lon: 79.5135, tz: 5.5 },
  { name: 'Mahbubnagar, Telangana', state: 'Telangana', lat: 16.7488, lon: 78.0035, tz: 5.5 },
  { name: 'Nalgonda, Telangana', state: 'Telangana', lat: 17.0577, lon: 79.2684, tz: 5.5 },
  { name: 'Adilabad, Telangana', state: 'Telangana', lat: 19.6641, lon: 78.5320, tz: 5.5 },
  { name: 'Siddipet, Telangana', state: 'Telangana', lat: 18.1018, lon: 78.8520, tz: 5.5 },

  // --- Andhra Pradesh ---
  { name: 'Visakhapatnam (Vizag), AP', state: 'Andhra Pradesh', lat: 17.6868, lon: 83.2185, tz: 5.5 },
  { name: 'Vijayawada, Andhra Pradesh', state: 'Andhra Pradesh', lat: 16.5062, lon: 80.6480, tz: 5.5 },
  { name: 'Guntur, Andhra Pradesh', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365, tz: 5.5 },
  { name: 'Nellore, Andhra Pradesh', state: 'Andhra Pradesh', lat: 14.4426, lon: 79.9865, tz: 5.5 },
  { name: 'Kurnool, Andhra Pradesh', state: 'Andhra Pradesh', lat: 15.8281, lon: 78.0373, tz: 5.5 },
  { name: 'Rajahmundry, Andhra Pradesh', state: 'Andhra Pradesh', lat: 17.0005, lon: 81.8040, tz: 5.5 },
  { name: 'Kakinada, Andhra Pradesh', state: 'Andhra Pradesh', lat: 16.9891, lon: 82.2475, tz: 5.5 },
  { name: 'Kadapa (Cuddapah), AP', state: 'Andhra Pradesh', lat: 14.4673, lon: 78.8242, tz: 5.5 },
  { name: 'Anantapur, Andhra Pradesh', state: 'Andhra Pradesh', lat: 14.6819, lon: 77.6006, tz: 5.5 },
  { name: 'Eluru, Andhra Pradesh', state: 'Andhra Pradesh', lat: 16.7107, lon: 81.0952, tz: 5.5 },
  { name: 'Ongole, Andhra Pradesh', state: 'Andhra Pradesh', lat: 15.5057, lon: 80.0499, tz: 5.5 },
  { name: 'Srikakulam, Andhra Pradesh', state: 'Andhra Pradesh', lat: 18.2969, lon: 83.8968, tz: 5.5 },
  { name: 'Amaravati, Andhra Pradesh', state: 'Andhra Pradesh', lat: 16.5131, lon: 80.5165, tz: 5.5 },

  // --- Uttar Pradesh ---
  { name: 'Lucknow, Uttar Pradesh', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462, tz: 5.5 },
  { name: 'Kanpur, Uttar Pradesh', state: 'Uttar Pradesh', lat: 26.4499, lon: 80.3319, tz: 5.5 },
  { name: 'Agra, Uttar Pradesh', state: 'Uttar Pradesh', lat: 27.1767, lon: 78.0081, tz: 5.5 },
  { name: 'Meerut, Uttar Pradesh', state: 'Uttar Pradesh', lat: 28.9845, lon: 77.7064, tz: 5.5 },
  { name: 'Bareilly, Uttar Pradesh', state: 'Uttar Pradesh', lat: 28.3670, lon: 79.4304, tz: 5.5 },
  { name: 'Aligarh, Uttar Pradesh', state: 'Uttar Pradesh', lat: 27.8974, lon: 78.0880, tz: 5.5 },
  { name: 'Moradabad, Uttar Pradesh', state: 'Uttar Pradesh', lat: 28.8351, lon: 78.7747, tz: 5.5 },
  { name: 'Saharanpur, Uttar Pradesh', state: 'Uttar Pradesh', lat: 29.9640, lon: 77.5460, tz: 5.5 },
  { name: 'Gorakhpur, Uttar Pradesh', state: 'Uttar Pradesh', lat: 26.7606, lon: 83.3732, tz: 5.5 },
  { name: 'Jhansi, Uttar Pradesh', state: 'Uttar Pradesh', lat: 25.4484, lon: 78.5685, tz: 5.5 },
  { name: 'Muzaffarnagar, Uttar Pradesh', state: 'Uttar Pradesh', lat: 29.4727, lon: 77.7085, tz: 5.5 },
  { name: 'Firozabad, Uttar Pradesh', state: 'Uttar Pradesh', lat: 27.1592, lon: 78.3957, tz: 5.5 },

  // --- Gujarat ---
  { name: 'Ahmedabad, Gujarat', state: 'Gujarat', lat: 23.0225, lon: 72.5714, tz: 5.5 },
  { name: 'Surat, Gujarat', state: 'Gujarat', lat: 21.1702, lon: 72.8311, tz: 5.5 },
  { name: 'Vadodara (Baroda), Gujarat', state: 'Gujarat', lat: 22.3072, lon: 73.1812, tz: 5.5 },
  { name: 'Rajkot, Gujarat', state: 'Gujarat', lat: 22.3039, lon: 70.8022, tz: 5.5 },
  { name: 'Bhavnagar, Gujarat', state: 'Gujarat', lat: 21.7645, lon: 72.1519, tz: 5.5 },
  { name: 'Jamnagar, Gujarat', state: 'Gujarat', lat: 22.4707, lon: 70.0577, tz: 5.5 },
  { name: 'Gandhinagar, Gujarat', state: 'Gujarat', lat: 23.2156, lon: 72.6369, tz: 5.5 },
  { name: 'Junagadh, Gujarat', state: 'Gujarat', lat: 21.5222, lon: 70.4579, tz: 5.5 },
  { name: 'Anand, Gujarat', state: 'Gujarat', lat: 22.5645, lon: 72.9289, tz: 5.5 },
  { name: 'Navsari, Gujarat', state: 'Gujarat', lat: 20.9500, lon: 72.9300, tz: 5.5 },
  { name: 'Morbi, Gujarat', state: 'Gujarat', lat: 22.8173, lon: 70.8370, tz: 5.5 },
  { name: 'Mehsana, Gujarat', state: 'Gujarat', lat: 23.5880, lon: 72.3693, tz: 5.5 },
  { name: 'Bharuch, Gujarat', state: 'Gujarat', lat: 21.7051, lon: 72.9959, tz: 5.5 },
  { name: 'Bhuj (Kutch), Gujarat', state: 'Gujarat', lat: 23.2420, lon: 69.6669, tz: 5.5 },
  { name: 'Porbandar, Gujarat', state: 'Gujarat', lat: 21.6417, lon: 69.6293, tz: 5.5 },

  // --- West Bengal ---
  { name: 'Kolkata (Calcutta), West Bengal', state: 'West Bengal', lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: 'Howrah, West Bengal', state: 'West Bengal', lat: 22.5958, lon: 88.2636, tz: 5.5 },
  { name: 'Asansol, West Bengal', state: 'West Bengal', lat: 23.6739, lon: 86.9524, tz: 5.5 },
  { name: 'Siliguri, West Bengal', state: 'West Bengal', lat: 26.7271, lon: 88.3953, tz: 5.5 },
  { name: 'Durgapur, West Bengal', state: 'West Bengal', lat: 23.5204, lon: 87.3119, tz: 5.5 },
  { name: 'Bardhaman (Burdwan), WB', state: 'West Bengal', lat: 23.2324, lon: 87.8615, tz: 5.5 },
  { name: 'Malda (English Bazar), WB', state: 'West Bengal', lat: 25.0069, lon: 88.1396, tz: 5.5 },
  { name: 'Baharampur, West Bengal', state: 'West Bengal', lat: 24.0988, lon: 88.2685, tz: 5.5 },
  { name: 'Kharagpur, West Bengal', state: 'West Bengal', lat: 22.3460, lon: 87.2320, tz: 5.5 },
  { name: 'Darjeeling, West Bengal', state: 'West Bengal', lat: 27.0410, lon: 88.2663, tz: 5.5 },

  // --- Rajasthan ---
  { name: 'Jaipur (Pink City), Rajasthan', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, tz: 5.5 },
  { name: 'Jodhpur (Sun City), Rajasthan', state: 'Rajasthan', lat: 26.2389, lon: 73.0243, tz: 5.5 },
  { name: 'Kota, Rajasthan', state: 'Rajasthan', lat: 25.2138, lon: 75.8648, tz: 5.5 },
  { name: 'Bikaner, Rajasthan', state: 'Rajasthan', lat: 28.0229, lon: 73.3119, tz: 5.5 },
  { name: 'Ajmer, Rajasthan', state: 'Rajasthan', lat: 26.4499, lon: 74.6399, tz: 5.5 },
  { name: 'Udaipur (City of Lakes), Rajasthan', state: 'Rajasthan', lat: 24.5854, lon: 73.7125, tz: 5.5 },
  { name: 'Bhilwara, Rajasthan', state: 'Rajasthan', lat: 25.3407, lon: 74.6313, tz: 5.5 },
  { name: 'Alwar, Rajasthan', state: 'Rajasthan', lat: 27.5530, lon: 76.6346, tz: 5.5 },
  { name: 'Bharatpur, Rajasthan', state: 'Rajasthan', lat: 27.2152, lon: 77.5030, tz: 5.5 },
  { name: 'Sikar, Rajasthan', state: 'Rajasthan', lat: 27.6094, lon: 75.1398, tz: 5.5 },
  { name: 'Pali, Rajasthan', state: 'Rajasthan', lat: 25.7711, lon: 73.3234, tz: 5.5 },
  { name: 'Sri Ganganagar, Rajasthan', state: 'Rajasthan', lat: 29.9038, lon: 73.8772, tz: 5.5 },
  { name: 'Chittorgarh, Rajasthan', state: 'Rajasthan', lat: 24.8887, lon: 74.6269, tz: 5.5 },
  { name: 'Jaisalmer, Rajasthan', state: 'Rajasthan', lat: 26.9157, lon: 70.9083, tz: 5.5 },

  // --- Madhya Pradesh ---
  { name: 'Bhopal, Madhya Pradesh', state: 'Madhya Pradesh', lat: 23.2599, lon: 77.4126, tz: 5.5 },
  { name: 'Indore, Madhya Pradesh', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, tz: 5.5 },
  { name: 'Jabalpur, Madhya Pradesh', state: 'Madhya Pradesh', lat: 23.1815, lon: 79.9864, tz: 5.5 },
  { name: 'Gwalior, Madhya Pradesh', state: 'Madhya Pradesh', lat: 26.2183, lon: 78.1828, tz: 5.5 },
  { name: 'Sagar, Madhya Pradesh', state: 'Madhya Pradesh', lat: 23.8388, lon: 78.7378, tz: 5.5 },
  { name: 'Dewas, Madhya Pradesh', state: 'Madhya Pradesh', lat: 22.9676, lon: 76.0534, tz: 5.5 },
  { name: 'Satna, Madhya Pradesh', state: 'Madhya Pradesh', lat: 24.5828, lon: 80.8294, tz: 5.5 },
  { name: 'Ratlam, Madhya Pradesh', state: 'Madhya Pradesh', lat: 23.3315, lon: 75.0367, tz: 5.5 },
  { name: 'Rewa, Madhya Pradesh', state: 'Madhya Pradesh', lat: 24.5362, lon: 81.3037, tz: 5.5 },
  { name: 'Singrauli, Madhya Pradesh', state: 'Madhya Pradesh', lat: 24.1993, lon: 82.6644, tz: 5.5 },
  { name: 'Khajuraho, Madhya Pradesh', state: 'Madhya Pradesh', lat: 24.8318, lon: 79.9199, tz: 5.5 },
  { name: 'Omkareshwar (Jyotirlinga), MP', state: 'Madhya Pradesh', lat: 22.2458, lon: 76.1500, tz: 5.5 },

  // --- Bihar ---
  { name: 'Patna, Bihar', state: 'Bihar', lat: 25.5941, lon: 85.1376, tz: 5.5 },
  { name: 'Bhagalpur, Bihar', state: 'Bihar', lat: 25.2425, lon: 86.9842, tz: 5.5 },
  { name: 'Muzaffarpur, Bihar', state: 'Bihar', lat: 26.1209, lon: 85.3647, tz: 5.5 },
  { name: 'Purnia, Bihar', state: 'Bihar', lat: 25.7771, lon: 87.4753, tz: 5.5 },
  { name: 'Darbhanga, Bihar', state: 'Bihar', lat: 26.1542, lon: 85.8918, tz: 5.5 },
  { name: 'Bihar Sharif, Bihar', state: 'Bihar', lat: 25.1982, lon: 85.5149, tz: 5.5 },
  { name: 'Arrah (Bhojpur), Bihar', state: 'Bihar', lat: 25.5560, lon: 84.6603, tz: 5.5 },
  { name: 'Begusarai, Bihar', state: 'Bihar', lat: 25.4182, lon: 86.1272, tz: 5.5 },
  { name: 'Katihar, Bihar', state: 'Bihar', lat: 25.5541, lon: 87.5716, tz: 5.5 },
  { name: 'Munger, Bihar', state: 'Bihar', lat: 25.3748, lon: 86.4735, tz: 5.5 },
  { name: 'Chhapra, Bihar', state: 'Bihar', lat: 25.7796, lon: 84.7499, tz: 5.5 },

  // --- Punjab & Chandigarh ---
  { name: 'Chandigarh (Capital)', state: 'Chandigarh', lat: 30.7333, lon: 76.7794, tz: 5.5 },
  { name: 'Ludhiana, Punjab', state: 'Punjab', lat: 30.9010, lon: 75.8573, tz: 5.5 },
  { name: 'Jalandhar, Punjab', state: 'Punjab', lat: 31.3260, lon: 75.5762, tz: 5.5 },
  { name: 'Patiala, Punjab', state: 'Punjab', lat: 30.3398, lon: 76.3869, tz: 5.5 },
  { name: 'Bathinda, Punjab', state: 'Punjab', lat: 30.2110, lon: 74.9455, tz: 5.5 },
  { name: 'Hoshiarpur, Punjab', state: 'Punjab', lat: 31.5143, lon: 75.9115, tz: 5.5 },
  { name: 'Mohali (SAS Nagar), Punjab', state: 'Punjab', lat: 30.7046, lon: 76.7179, tz: 5.5 },
  { name: 'Pathankot, Punjab', state: 'Punjab', lat: 32.2684, lon: 75.6499, tz: 5.5 },

  // --- Haryana ---
  { name: 'Panipat, Haryana', state: 'Haryana', lat: 29.3909, lon: 76.9635, tz: 5.5 },
  { name: 'Ambala, Haryana', state: 'Haryana', lat: 30.3782, lon: 76.7767, tz: 5.5 },
  { name: 'Yamunanagar, Haryana', state: 'Haryana', lat: 30.1290, lon: 77.2674, tz: 5.5 },
  { name: 'Rohtak, Haryana', state: 'Haryana', lat: 28.8955, lon: 76.6066, tz: 5.5 },
  { name: 'Hisar, Haryana', state: 'Haryana', lat: 29.1492, lon: 75.7217, tz: 5.5 },
  { name: 'Karnal, Haryana', state: 'Haryana', lat: 29.6857, lon: 76.9905, tz: 5.5 },
  { name: 'Sonipat, Haryana', state: 'Haryana', lat: 28.9931, lon: 77.0151, tz: 5.5 },
  { name: 'Panchkula, Haryana', state: 'Haryana', lat: 30.6942, lon: 76.8606, tz: 5.5 },
  { name: 'Bhiwani, Haryana', state: 'Haryana', lat: 28.7932, lon: 76.1390, tz: 5.5 },

  // --- Kerala ---
  { name: 'Thiruvananthapuram (Trivandrum), Kerala', state: 'Kerala', lat: 8.5241, lon: 76.9366, tz: 5.5 },
  { name: 'Kochi (Cochin / Ernakulam), Kerala', state: 'Kerala', lat: 9.9312, lon: 76.2673, tz: 5.5 },
  { name: 'Kozhikode (Calicut), Kerala', state: 'Kerala', lat: 11.2588, lon: 75.7804, tz: 5.5 },
  { name: 'Thrissur, Kerala', state: 'Kerala', lat: 10.5276, lon: 76.2144, tz: 5.5 },
  { name: 'Kollam (Quilon), Kerala', state: 'Kerala', lat: 8.8932, lon: 76.6141, tz: 5.5 },
  { name: 'Kannur, Kerala', state: 'Kerala', lat: 11.8745, lon: 75.3704, tz: 5.5 },
  { name: 'Alappuzha (Alleppey), Kerala', state: 'Kerala', lat: 9.4981, lon: 76.3388, tz: 5.5 },
  { name: 'Palakkad, Kerala', state: 'Kerala', lat: 10.7867, lon: 76.6548, tz: 5.5 },
  { name: 'Kottayam, Kerala', state: 'Kerala', lat: 9.5916, lon: 76.5222, tz: 5.5 },
  { name: 'Kasaragod, Kerala', state: 'Kerala', lat: 12.5102, lon: 74.9852, tz: 5.5 },

  // --- Odisha ---
  { name: 'Bhubaneswar, Odisha', state: 'Odisha', lat: 20.2961, lon: 85.8245, tz: 5.5 },
  { name: 'Cuttack, Odisha', state: 'Odisha', lat: 20.4625, lon: 85.8830, tz: 5.5 },
  { name: 'Rourkela, Odisha', state: 'Odisha', lat: 22.2604, lon: 84.8536, tz: 5.5 },
  { name: 'Berhampur (Brahmapur), Odisha', state: 'Odisha', lat: 19.3149, lon: 84.7941, tz: 5.5 },
  { name: 'Sambalpur, Odisha', state: 'Odisha', lat: 21.4669, lon: 83.9812, tz: 5.5 },
  { name: 'Balasore, Odisha', state: 'Odisha', lat: 21.4934, lon: 86.9135, tz: 5.5 },

  // --- Uttarakhand ---
  { name: 'Dehradun, Uttarakhand', state: 'Uttarakhand', lat: 30.3165, lon: 78.0322, tz: 5.5 },
  { name: 'Roorkee, Uttarakhand', state: 'Uttarakhand', lat: 29.8543, lon: 77.8880, tz: 5.5 },
  { name: 'Haldwani, Uttarakhand', state: 'Uttarakhand', lat: 29.2183, lon: 79.5130, tz: 5.5 },
  { name: 'Nainital, Uttarakhand', state: 'Uttarakhand', lat: 29.3919, lon: 79.4542, tz: 5.5 },
  { name: 'Almora, Uttarakhand', state: 'Uttarakhand', lat: 29.5971, lon: 79.6591, tz: 5.5 },
  { name: 'Rudraprayag, Uttarakhand', state: 'Uttarakhand', lat: 30.2844, lon: 78.9811, tz: 5.5 },

  // --- Himachal Pradesh ---
  { name: 'Shimla, Himachal Pradesh', state: 'Himachal Pradesh', lat: 31.1048, lon: 77.1734, tz: 5.5 },
  { name: 'Dharamshala, Himachal Pradesh', state: 'Himachal Pradesh', lat: 32.2190, lon: 76.3234, tz: 5.5 },
  { name: 'Solan, Himachal Pradesh', state: 'Himachal Pradesh', lat: 30.9045, lon: 77.0967, tz: 5.5 },
  { name: 'Mandi, Himachal Pradesh', state: 'Himachal Pradesh', lat: 31.7087, lon: 76.9320, tz: 5.5 },
  { name: 'Kullu, Himachal Pradesh', state: 'Himachal Pradesh', lat: 31.9579, lon: 77.1095, tz: 5.5 },
  { name: 'Manali, Himachal Pradesh', state: 'Himachal Pradesh', lat: 32.2432, lon: 77.1892, tz: 5.5 },

  // --- Jammu & Kashmir and Ladakh ---
  { name: 'Srinagar, Jammu & Kashmir', state: 'Jammu & Kashmir', lat: 34.0837, lon: 74.7973, tz: 5.5 },
  { name: 'Jammu (Tawi), Jammu & Kashmir', state: 'Jammu & Kashmir', lat: 32.7266, lon: 74.8570, tz: 5.5 },
  { name: 'Katra (Vaishno Devi), J&K', state: 'Jammu & Kashmir', lat: 32.9926, lon: 74.9317, tz: 5.5 },
  { name: 'Anantnag, Jammu & Kashmir', state: 'Jammu & Kashmir', lat: 33.7311, lon: 75.1506, tz: 5.5 },
  { name: 'Leh, Ladakh', state: 'Ladakh', lat: 34.1526, lon: 77.5771, tz: 5.5 },
  { name: 'Kargil, Ladakh', state: 'Ladakh', lat: 34.5539, lon: 76.1349, tz: 5.5 },

  // --- Jharkhand ---
  { name: 'Ranchi, Jharkhand', state: 'Jharkhand', lat: 23.3441, lon: 85.3096, tz: 5.5 },
  { name: 'Jamshedpur (Tatanagar), Jharkhand', state: 'Jharkhand', lat: 22.8046, lon: 86.2029, tz: 5.5 },
  { name: 'Dhanbad, Jharkhand', state: 'Jharkhand', lat: 23.7957, lon: 86.4304, tz: 5.5 },
  { name: 'Bokaro Steel City, Jharkhand', state: 'Jharkhand', lat: 23.6693, lon: 86.1511, tz: 5.5 },
  { name: 'Deoghar (Baidyanath Dham), Jharkhand', state: 'Jharkhand', lat: 24.4826, lon: 86.7001, tz: 5.5 },
  { name: 'Hazaribagh, Jharkhand', state: 'Jharkhand', lat: 23.9937, lon: 85.3637, tz: 5.5 },

  // --- Chhattisgarh ---
  { name: 'Raipur, Chhattisgarh', state: 'Chhattisgarh', lat: 21.2514, lon: 81.6296, tz: 5.5 },
  { name: 'Bhilai / Durg, Chhattisgarh', state: 'Chhattisgarh', lat: 21.1938, lon: 81.3509, tz: 5.5 },
  { name: 'Bilaspur, Chhattisgarh', state: 'Chhattisgarh', lat: 22.0797, lon: 82.1409, tz: 5.5 },
  { name: 'Korba, Chhattisgarh', state: 'Chhattisgarh', lat: 22.3595, lon: 82.7501, tz: 5.5 },
  { name: 'Rajnandgaon, Chhattisgarh', state: 'Chhattisgarh', lat: 21.0974, lon: 81.0374, tz: 5.5 },
  { name: 'Jagdalpur, Chhattisgarh', state: 'Chhattisgarh', lat: 19.0744, lon: 82.0081, tz: 5.5 },

  // --- Assam & Northeast States ---
  { name: 'Guwahati (Kamakhya Dham), Assam', state: 'Assam', lat: 26.1445, lon: 91.7362, tz: 5.5 },
  { name: 'Silchar, Assam', state: 'Assam', lat: 24.8170, lon: 92.7985, tz: 5.5 },
  { name: 'Dibrugarh, Assam', state: 'Assam', lat: 27.4728, lon: 94.9120, tz: 5.5 },
  { name: 'Jorhat, Assam', state: 'Assam', lat: 26.7509, lon: 94.2037, tz: 5.5 },
  { name: 'Tezpur, Assam', state: 'Assam', lat: 26.6528, lon: 92.7926, tz: 5.5 },
  { name: 'Shillong, Meghalaya', state: 'Meghalaya', lat: 25.5788, lon: 91.8933, tz: 5.5 },
  { name: 'Agartala, Tripura', state: 'Tripura', lat: 23.8315, lon: 91.2868, tz: 5.5 },
  { name: 'Imphal, Manipur', state: 'Manipur', lat: 24.8170, lon: 93.9368, tz: 5.5 },
  { name: 'Aizawl, Mizoram', state: 'Mizoram', lat: 23.7271, lon: 92.7176, tz: 5.5 },
  { name: 'Kohima, Nagaland', state: 'Nagaland', lat: 25.6751, lon: 94.1086, tz: 5.5 },
  { name: 'Dimapur, Nagaland', state: 'Nagaland', lat: 25.9095, lon: 93.7266, tz: 5.5 },
  { name: 'Gangtok, Sikkim', state: 'Sikkim', lat: 27.3389, lon: 88.6065, tz: 5.5 },
  { name: 'Itanagar, Arunachal Pradesh', state: 'Arunachal Pradesh', lat: 27.0844, lon: 93.6053, tz: 5.5 },

  // --- Goa & Coastal UTs ---
  { name: 'Panaji, Goa', state: 'Goa', lat: 15.4909, lon: 73.8278, tz: 5.5 },
  { name: 'Margao (Madgaon), Goa', state: 'Goa', lat: 15.2832, lon: 73.9862, tz: 5.5 },
  { name: 'Vasco da Gama, Goa', state: 'Goa', lat: 15.3959, lon: 73.8157, tz: 5.5 },
  { name: 'Puducherry (Pondicherry)', state: 'Puducherry', lat: 11.9416, lon: 79.8083, tz: 5.5 },
  { name: 'Port Blair, Andaman & Nicobar', state: 'Andaman & Nicobar', lat: 11.6234, lon: 92.7265, tz: 5.5 },
  { name: 'Daman, Dadra & Nagar Haveli and Daman & Diu', state: 'Daman & Diu', lat: 20.3974, lon: 72.8328, tz: 5.5 },
  { name: 'Silvassa, Dadra & Nagar Haveli', state: 'Dadra & Nagar Haveli', lat: 20.2763, lon: 73.0083, tz: 5.5 },
  { name: 'Kavaratti, Lakshadweep', state: 'Lakshadweep', lat: 10.5669, lon: 72.6420, tz: 5.5 }
];

/**
 * Filter or search Indian places by city or state name
 */
export function searchIndianPlaces(query) {
  if (!query || query.trim() === '') return INDIAN_PLACES;
  const q = query.toLowerCase().trim();
  return INDIAN_PLACES.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.state.toLowerCase().includes(q)
  );
}

/**
 * Helper to generate HTML <datalist> options for autocomplete
 */
export function renderIndianPlacesDatalist(datalistId = 'indian-places-list') {
  return `
    <datalist id="${datalistId}">
      ${INDIAN_PLACES.map(p => `
        <option value="${p.name}" data-lat="${p.lat}" data-lon="${p.lon}" data-tz="${p.tz}">
          ${p.name} (Lat: ${p.lat.toFixed(2)}, Lon: ${p.lon.toFixed(2)})
        </option>
      `).join('')}
    </datalist>
  `;
}

/**
 * Match a location string to place object
 */
export function findIndianPlace(placeName) {
  if (!placeName) return null;
  const exact = INDIAN_PLACES.find(p => p.name.toLowerCase() === placeName.toLowerCase().trim());
  if (exact) return exact;
  const partial = INDIAN_PLACES.find(p => placeName.toLowerCase().includes(p.name.split(',')[0].toLowerCase().trim()));
  return partial || null;
}
