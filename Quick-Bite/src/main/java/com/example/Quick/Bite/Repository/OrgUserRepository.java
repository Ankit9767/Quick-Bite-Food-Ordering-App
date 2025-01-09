package com.example.Quick.Bite.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Quick.Bite.Domain.OrgUser;

@Repository
public interface OrgUserRepository extends JpaRepository<OrgUser, Long> {

    Optional<OrgUser> findByUserName(String userName);
    Optional<OrgUser> findByEmail(String email);
    }


