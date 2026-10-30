package com.celebritycrm.contracts.repository;

import com.celebritycrm.contracts.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    Optional<Contract> findByContractNumber(String contractNumber);

    boolean existsByContractNumber(String contractNumber);

    boolean existsByContractNumberAndIdNot(String contractNumber, Long id);

    List<Contract> findByCelebrityId(Long celebrityId);

    List<Contract> findByStatusIgnoreCase(String status);

    List<Contract> findByClientNameContainingIgnoreCase(String clientName);
}

