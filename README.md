# CASE STUDY 2
Dưới đây là một chương trình có nhiệm vụ chuyển file ảnh tiếng Anh sang một file `pdf` tiếng Việt. Các bước xử lý lần lượt bao gồm: chuyển đổi ảnh sang text, dịch tiếng Anh sang tiếng Việt, chuyển đổi nội dung text thành file `pdf`. Chương trình chính chỉ demo các tính năng này tuần tự.

## Hướng dẫn cài đặt
Yêu cầu cài đặt trước [tesseract](https://tesseract-ocr.github.io/tessdoc/Installation.html) trên hệ điều hành của bạn. 

```sh
# Cài đặt các gói liên quan
$ npm install
# Tạo folder cho output
$ mkdir output
# Khởi chạy ứng dụng demo
$ npm start
```

## Mô Tả
| File | Chức năng |
|--|:--|
| utils/ocr.js | Chuyển đổi ảnh sang text |
| utils/translate.js | Dịch tiếng Anh sang tiếng Việt |
| utils/pdf.js | Chuyển đổi text sang PDF |

## Yêu cầu
 - Hoàn thiện chương trình sử dụng `express.js` cho phép upload một file ảnh và trả về một file `pdf` tương ứng
 - Sử dụng `Pipes and Filters pattern` và `message queue` để hoàn thiện chương trình trên.


> Lưu ý: File sẽ được chỉnh sửa liên tục cho phù hợp với hướng phát triển của phần mềm. Hãy thẳng thắn góp ý nếu thấy cần thiết phải sửa file.
# Định hướng phần mềm
- Ứng dụng sử dụng Tesseract OCR để nhận biết chữ và xuất thành file.
- Phát triển cả Frontend và Backend, sử dụng modulde express để host web.
- Quá trình phát triển có sử dụng hai mẫu kiến trúc Pipes and Filters và Message Queue.

# Frontend
- Tạo nút bấm cho phép upload ảnh với nhiều lựa chọn khác nhau (.img, .jpg, .jpeg,...).
- Cho phép upload nhiều file cùng lúc.
- File xuất ra có thể có nhiều loại (.docx, .pdf, .txt,...).
- Người dùng có thể chọn bất cứ loại input hoặc output nào trong danh sách cho phép.
- Tham khảo trang web sau: https://www.onlineocr.net/

# Backend
- Nhận được input thuộc các kiểu (.img, .jpg, .jpeg,...).
- Xuất được output thuộc các kiểu (.docx, .pdf, .txt,...).
- Ưu tiên phát triển cho phép nhận input .img và xuất output .pdf trước.
- Có sử dụng hai mẫu kiến trúc Pipes and Filters và Message Queue.
- Sử dụng module express.js để host web, tải thêm module nodemon để reload project liên tục tự động mỗi khi có thay đổi trong quá trình phát triển. Tham khảo tại [đây](https://youtu.be/SccSCuHhOw0?si=6uIAmKSjHyeIVz1W&t=63).

# Hướng dẫn tìm hiểu
## Mẫu kiến trúc Message Queue
- Lý thuyết: https://aws.amazon.com/message-queue/
- Video tìm hiểu: https://youtu.be/Cie5v59mrTg?si=t1WumWseqJcdvzPw
## Mẫu kiến trúc Pipes and Filters
- Lý thuyết: https://learn.microsoft.com/en-us/azure/architecture/patterns/pipes-and-filters

# Chạy chương trình
- Chương trình sử dụng npm để host web. Tìm hiểu thêm ở [đây](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Tải [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Tìm kiếm rabbitmq, chọn tag Management, pull về, run container
![image](https://github.com/user-attachments/assets/8a5d3eae-55cf-4003-bca3-e3020cb1ec0b)
- Clone chương trình:
```
git clone https://github.com/3-I-Projects/KTPM-architecture-solution.git
```
- Tải các depedencies cần thiết:
```
npm install
```
- Chạy chương trình:
```
npm run devStart
```
