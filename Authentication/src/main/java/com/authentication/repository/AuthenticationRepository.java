package com.authentication.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.authentication.entity.Authentication;

public interface AuthenticationRepository extends JpaRepository<Authentication, Integer>{
}
