package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.entity.User;
import com.example.VeagleSpaceTech.model.UserPrincipal;
import com.example.VeagleSpaceTech.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo repo;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = repo.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found: " + username));

        return new UserPrincipal(user);
    }



}
