package com.celebritycrm.ott.project.repository;

import com.celebritycrm.ott.project.entity.OttProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OttProjectRepository extends JpaRepository<OttProject, Long> {

    List<OttProject> findByPlatformIgnoreCase(String platform);

    List<OttProject> findByStatusIgnoreCase(String status);

    List<OttProject> findByGenreIgnoreCase(String genre);

    List<OttProject> findByLeadStarIgnoreCase(String leadStar);

    List<OttProject> findByCelebrityId(Long celebrityId);

    List<OttProject> findByPlatformIgnoreCaseAndStatusIgnoreCase(String platform, String status);
}

