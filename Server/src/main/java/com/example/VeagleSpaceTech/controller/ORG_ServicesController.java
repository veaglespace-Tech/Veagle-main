package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.ServiceRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ServicesResponseDTO;
import com.example.VeagleSpaceTech.service.ORG_ServicesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ORG_ServicesController {

    private final ORG_ServicesService orgServicesService;

    // Add Service In DB
//    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping(value = "/admin/addService", consumes = "multipart/form-data")
//    public ResponseEntity<ServicesResponseDTO> addService(
//            @RequestPart("file") MultipartFile file,
//            @RequestParam("data") String request
//    ) {
//        System.out.println("\nfile  "+file);
//        System.out.println("\nData  "+request);
//        return null;
//        return ResponseEntity.status(201)
//                .body(orgServicesService.save(file, request));
//    }


    // fetch Services
    @GetMapping("/api/public/services")
    public ResponseEntity<List<ServicesResponseDTO>> getServices(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(orgServicesService.getAllServices(keyword));
    }

    @GetMapping("/api/public/services/{id}")
    public ResponseEntity<ServicesResponseDTO> getSingleService(@PathVariable("id") Long id ){

        return ResponseEntity.ok(orgServicesService.getServiceById(id));
    }

    @PostMapping(value = "/api/admin/services", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ServicesResponseDTO> addService(
            @RequestPart("file") MultipartFile file,
            @RequestParam("data") String request
    ) throws Exception {

//        System.out.println("\nfile  " + file);
//        System.out.println("\nData  " + request);

        ObjectMapper mapper = new ObjectMapper();

        ServiceRequestDTO dto =
                mapper.readValue(request, ServiceRequestDTO.class);

        return ResponseEntity.status(201)
                .body(orgServicesService.save(file, dto));
    }

   //  Update Service From DB
   @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
   @PutMapping(value = "/api/admin/services/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<ServicesResponseDTO> updateService(
           @PathVariable Long id,
           @RequestPart(value = "file", required = false) MultipartFile file,
           @RequestParam("data") String request
   ) throws Exception {

       ObjectMapper mapper = new ObjectMapper();

       ServiceRequestDTO dto =
               mapper.readValue(request, ServiceRequestDTO.class);

       return ResponseEntity.ok(
               orgServicesService.update(id, file, dto)
       );
   }

    // Delete Service From DB
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @DeleteMapping("/api/admin/services/{id}")
    public ResponseEntity<String> deletService(@PathVariable Long id){
        orgServicesService.deleted(id);
        return ResponseEntity.ok().body("Deleted...");
    }


 // Used For Show all Services from DB and Searched Services from DB Using Pagination
// @GetMapping("ser/services")
// public ResponseEntity<PageResponse<ServicesResponseDTO>> getServices(
//         @RequestParam(required = false) String keyword,
//         @RequestParam(defaultValue = "0") int page,
//         @RequestParam(defaultValue = "5") int size
// ) {
////     System.out.println("\nKeywords "+keyword);
//     return ResponseEntity.ok(orgServicesService.getServices(keyword, page, size));
// }




}
