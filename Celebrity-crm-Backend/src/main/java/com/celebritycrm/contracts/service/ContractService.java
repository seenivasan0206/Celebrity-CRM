package com.celebritycrm.contracts.service;

import com.celebritycrm.common.ResourceNotFoundException;
import com.celebritycrm.contracts.dto.ContractRequest;
import com.celebritycrm.contracts.dto.ContractResponse;
import com.celebritycrm.contracts.entity.Contract;
import com.celebritycrm.contracts.repository.ContractRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContractService {

    private final ContractRepository contractRepository;

    public ContractService(ContractRepository contractRepository) {
        this.contractRepository = contractRepository;
    }

    public ContractResponse createContract(ContractRequest request) {
        String contractNumber = request.getContractNumber();
        if (contractNumber == null || contractNumber.isBlank()) {
            contractNumber = "CNT-" + System.currentTimeMillis();
        } else {
            contractNumber = contractNumber.trim();
            if (contractRepository.existsByContractNumber(contractNumber)) {
                throw new IllegalArgumentException("Contract with number '" + contractNumber + "' already exists.");
            }
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }

        Contract contract = new Contract();
        contract.setContractNumber(contractNumber);
        contract.setTitle(request.getTitle());
        contract.setCelebrityId(request.getCelebrityId());
        contract.setCelebrityName(request.getCelebrityName());
        contract.setClientName(request.getClientName());
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setTotalValue(request.getTotalValue());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            contract.setStatus(request.getStatus().toUpperCase());
        }
        contract.setTerms(request.getTerms());
        contract.setManagerId(request.getManagerId());

        Contract saved = contractRepository.save(contract);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> getAllContracts(String status, Long celebrityId) {
        List<Contract> contracts;
        if (celebrityId != null) {
            contracts = contractRepository.findByCelebrityId(celebrityId);
        } else if (status != null && !status.isBlank()) {
            contracts = contractRepository.findByStatusIgnoreCase(status);
        } else {
            contracts = contractRepository.findAll();
        }
        return contracts.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ContractResponse getContractById(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + id));
        return mapToResponse(contract);
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> getContractsByCelebrity(Long celebrityId) {
        return contractRepository.findByCelebrityId(celebrityId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ContractResponse updateContract(Long id, ContractRequest request) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + id));

        if (request.getContractNumber() != null && !request.getContractNumber().isBlank()) {
            String newNumber = request.getContractNumber().trim();
            if (contractRepository.existsByContractNumberAndIdNot(newNumber, id)) {
                throw new IllegalArgumentException("Another contract with number '" + newNumber + "' already exists.");
            }
            contract.setContractNumber(newNumber);
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }

        contract.setTitle(request.getTitle());
        contract.setCelebrityId(request.getCelebrityId());
        contract.setCelebrityName(request.getCelebrityName());
        contract.setClientName(request.getClientName());
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setTotalValue(request.getTotalValue());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            contract.setStatus(request.getStatus().toUpperCase());
        }
        contract.setTerms(request.getTerms());
        contract.setManagerId(request.getManagerId());

        Contract updated = contractRepository.save(contract);
        return mapToResponse(updated);
    }

    public ContractResponse updateStatus(Long id, String status) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + id));
        contract.setStatus(status.toUpperCase());
        Contract updated = contractRepository.save(contract);
        return mapToResponse(updated);
    }

    public void deleteContract(Long id) {
        if (!contractRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contract not found with ID: " + id);
        }
        contractRepository.deleteById(id);
    }

    public ContractResponse mapToResponse(Contract contract) {
        ContractResponse response = new ContractResponse();
        response.setId(contract.getId());
        response.setContractNumber(contract.getContractNumber());
        response.setTitle(contract.getTitle());
        response.setCelebrityId(contract.getCelebrityId());
        response.setCelebrityName(contract.getCelebrityName());
        response.setClientName(contract.getClientName());
        response.setStartDate(contract.getStartDate());
        response.setEndDate(contract.getEndDate());
        response.setTotalValue(contract.getTotalValue());
        response.setStatus(contract.getStatus());
        response.setTerms(contract.getTerms());
        response.setManagerId(contract.getManagerId());
        response.setCreatedAt(contract.getCreatedAt());
        response.setUpdatedAt(contract.getUpdatedAt());
        return response;
    }
}

