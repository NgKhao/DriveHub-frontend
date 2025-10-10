// Car Marketplace - Sample POST Requests for Creating Posts
// Base URL: POST http://localhost:8080/api/seller/posts
// Headers: Authorization: Bearer {seller_token}, Content-Type: multipart/form-data
// Form Data: postDTO (JSON below) + imageFile (file upload)

// 1. BMW 330i M Sport 2022
{
  "title": "BMW 330i M Sport 2022 - Xe thể thao cao cấp",
  "description": "BMW 330i M Sport 2022 màu trắng, nội thất đen. Xe gia đình sử dụng ít, bảo dưỡng định kỳ tại hãng. Còn bảo hành chính hãng. Xe có đầy đủ tính năng an toàn và tiện nghi cao cấp.",
  "price": 1850000000,
  "location": "Quận 1, Hồ Chí Minh",
  "phoneContact": "0901234567",
  "sellerType": "INDIVIDUAL",
  "carDetailDTO": {
    "make": "BMW",
    "model": "3 Series",
    "year": 2022,
    "mileage": 15000,
    "fuelType": "gasoline",
    "transmission": "automatic",
    "color": "Trắng",
    "condition": "used"
  }
}

// 2. Ford Territory Titanium X 1.5 AT 2023
{
  "title": "Ford Territory Titanium X 1.5 AT 2023 - SUV 7 chỗ hiện đại",
  "description": "Ford Territory Titanium X 2023 màu đen, SUV 7 chỗ rộng rãi, tiết kiệm nhiên liệu. Xe được trang bị đầy đủ công nghệ hiện đại, hệ thống an toàn 5 sao. Phù hợp cho gia đình và đi công tác.",
  "price": 920000000,
  "location": "Quận 7, Hồ Chí Minh",
  "phoneContact": "0987654321",
  "sellerType": "AGENCY",
  "carDetailDTO": {
    "make": "Ford",
    "model": "Territory",
    "year": 2023,
    "mileage": 5000,
    "fuelType": "gasoline",
    "transmission": "automatic",
    "color": "Đen",
    "condition": "used"
  }
}

// 3. Hyundai Kona 2021 2.0 ATH
{
  "title": "Hyundai Kona 2021 2.0 ATH - Crossover năng động",
  "description": "Hyundai Kona 2021 màu xanh dương, động cơ 2.0L mạnh mẽ. Xe crossover cỡ nhỏ, phù hợp di chuyển trong thành phố. Tiết kiệm nhiên liệu, bảo dưỡng rẻ. Nội thất trẻ trung, hiện đại.",
  "price": 680000000,
  "location": "Quận Bình Thạnh, Hồ Chí Minh",
  "phoneContact": "0912345678",
  "sellerType": "INDIVIDUAL",
  "carDetailDTO": {
    "make": "Hyundai",
    "model": "Kona",
    "year": 2021,
    "mileage": 28000,
    "fuelType": "gasoline",
    "transmission": "automatic",
    "color": "Xanh dương",
    "condition": "used"
  }
}

// 4. Mazda CX-30 Premium 2023
{
  "title": "Mazda CX-30 Premium 2023 - Crossover sang trọng",
  "description": "Mazda CX-30 Premium 2023 màu đỏ soul red, thiết kế Kodo đẹp mắt. Xe nhập khẩu nguyên chiếc từ Thái Lan, động cơ Skyactiv tiết kiệm nhiên liệu. Nội thất cao cấp, âm thanh Bose.",
  "price": 850000000,
  "location": "Quận 3, Hồ Chí Minh",
  "phoneContact": "0923456789",
  "sellerType": "AGENCY",
  "carDetailDTO": {
    "make": "Mazda",
    "model": "CX-30",
    "year": 2023,
    "mileage": 12000,
    "fuelType": "gasoline",
    "transmission": "automatic",
    "color": "Đỏ",
    "condition": "used"
  }
}

// 5. Mercedes-Benz C300 AMG 2022
{
  "title": "Mercedes-Benz C300 AMG 2022 - Sedan hạng sang",
  "description": "Mercedes-Benz C300 AMG 2022 màu bạc, nội thất da đen sang trọng. Xe sedan hạng sang, động cơ turbo mạnh mẽ. Đầy đủ tính năng an toàn và giải trí cao cấp. Bảo dưỡng định kỳ tại hãng.",
  "price": 2150000000,
  "location": "Quận 2, Hồ Chí Minh",
  "phoneContact": "0934567890",
  "sellerType": "INDIVIDUAL",
  "carDetailDTO": {
    "make": "Mercedes-Benz",
    "model": "C Class",
    "year": 2022,
    "mileage": 18000,
    "fuelType": "gasoline",
    "transmission": "automatic",
    "color": "Bạc",
    "condition": "used"
  }
}

// 6. VinFast VF5 Plus 2024
{
  "title": "VinFast VF5 Plus 2024 - Xe điện thông minh",
  "description": "VinFast VF5 Plus 2024 màu trắng ngọc trai, xe điện 100% thân thiện môi trường. Trang bị đầy đủ công nghệ thông minh, sạc nhanh, phạm vi hoạt động 285km. Xe mới, còn bảo hành chính hãng.",
  "price": 550000000,
  "location": "Quận 9, Hồ Chí Minh",
  "phoneContact": "0945678901",
  "sellerType": "AGENCY",
  "carDetailDTO": {
    "make": "Vinfast",
    "model": "VF5",
    "year": 2024,
    "mileage": 3000,
    "fuelType": "electric",
    "transmission": "automatic",
    "color": "Trắng",
    "condition": "new"
  }
}

// 7. Toyota Camry 2023 (Additional example)
{
  "title": "Toyota Camry 2.5Q 2023 - Sedan gia đình tin cậy",
  "description": "Toyota Camry 2.5Q 2023 màu đen, xe sedan hạng D cao cấp. Động cơ 2.5L vận hành êm ái, tiết kiệm nhiên liệu. Trang bị đầy đủ tiện nghi, hệ thống an toàn Toyota Safety Sense 2.0.",
  "price": 1320000000,
  "location": "Quận Tân Bình, Hồ Chí Minh",
  "phoneContact": "0956789012",
  "sellerType": "INDIVIDUAL",
  "carDetailDTO": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "mileage": 8000,
    "fuelType": "gasoline",
    "transmission": "automatic",
    "color": "Đen",
    "condition": "used"
  }
}

// 8. Honda CR-V 2022 (Additional example)
{
  "title": "Honda CR-V L 2022 - SUV 7 chỗ thực dụng",
  "description": "Honda CR-V L 2022 màu trắng ngọc trai, SUV 7 chỗ rộng rãi. Động cơ VTEC Turbo 1.5L mạnh mẽ, tiết kiệm nhiên liệu. Honda SENSING đầy đủ, phù hợp cho gia đình đông người.",
  "price": 1180000000,
  "location": "Quận 4, Hồ Chí Minh",
  "phoneContact": "0967890123",
  "sellerType": "AGENCY",
  "carDetailDTO": {
    "make": "Honda",
    "model": "CR-V",
    "year": 2022,
    "mileage": 22000,
    "fuelType": "gasoline",
    "transmission": "automatic",
    "color": "Trắng",
    "condition": "used"
  }
}

/*
HƯỚNG DẪN SỬ DỤNG POSTMAN:

1. Method: POST
2. URL: http://localhost:8080/api/seller/posts
3. Headers:
   - Authorization: Bearer {your_seller_jwt_token}
   - Content-Type: multipart/form-data (sẽ tự động set)

4. Body: 
   - Chọn form-data
   - Thêm key "postDTO" với type "Text", paste JSON ở trên
   - Thêm key "imageFile" với type "File", upload ảnh xe

5. Các trường trong JSON:
   - sellerType: "INDIVIDUAL" hoặc "AGENCY"
   - fuelType: "gasoline", "diesel", "hybrid", "electric"
   - transmission: "automatic", "manual"
   - condition: "new", "used"
   - price: Giá bằng VND (số nguyên)
   - mileage: Số km đã đi
   - year: Năm sản xuất (1990 - 2025)

6. Lưu ý:
   - Cần có token của seller để tạo post
   - Nên upload ít nhất 1 ảnh xe
   - Giá tiền nên hợp lý với thị trường
*/