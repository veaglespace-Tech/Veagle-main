package com.example.VeagleSpaceTech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class VeagleSpaceTechApplication {

	public static void main(String[] args) {
		SpringApplication.run(VeagleSpaceTechApplication.class, args);

        // Deployed Project

        System.out.println("Started... ");
	}

}
