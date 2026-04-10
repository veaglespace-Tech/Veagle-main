package com.example.VeagleSpaceTech.DTO.request;

public record JobApplicationRequestDTO(

//        Long userid  --- Still Dont Had Becuse UnRegisterd User Can Apply to Job
        String name,
        String email,
        String phone,

        Long jobId

) {}