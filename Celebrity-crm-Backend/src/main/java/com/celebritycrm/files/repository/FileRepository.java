package com.celebritycrm.files.repository;

import com.celebritycrm.files.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {
    Optional<FileEntity> findByFileName(String fileName);
    boolean existsByFileName(String fileName);
    void deleteByFileName(String fileName);
}

