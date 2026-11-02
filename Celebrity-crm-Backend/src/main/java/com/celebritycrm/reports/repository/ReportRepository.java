package com.celebritycrm.reports.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ReportRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Map<String, Long> getCelebrityCategoryBreakdown() {
        return getGroupCount("SELECT c.category, COUNT(c) FROM Celebrity c GROUP BY c.category");
    }

    public Map<String, Long> getCelebrityStatusBreakdown() {
        return getGroupCount("SELECT c.status, COUNT(c) FROM Celebrity c GROUP BY c.status");
    }

    public long getTotalCelebrityFollowers() {
        Object result = entityManager.createQuery("SELECT COALESCE(SUM(c.followersCount), 0) FROM Celebrity c")
                .getSingleResult();
        return result != null ? ((Number) result).longValue() : 0L;
    }

    public BigDecimal getAverageCelebrityFee() {
        Object result = entityManager.createQuery("SELECT COALESCE(AVG(c.standardFee), 0) FROM Celebrity c")
                .getSingleResult();
        if (result != null) {
            return BigDecimal.valueOf(((Number) result).doubleValue()).setScale(2, RoundingMode.HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    public Map<String, Long> getAgencyCountryBreakdown() {
        return getGroupCount("SELECT COALESCE(a.country, 'Unknown'), COUNT(a) FROM Agency a GROUP BY a.country");
    }

    public Map<String, Long> getAgencyStatusBreakdown() {
        return getGroupCount("SELECT a.status, COUNT(a) FROM Agency a GROUP BY a.status");
    }

    public BigDecimal getAverageAgencyCommissionRate() {
        Object result = entityManager.createQuery("SELECT COALESCE(AVG(a.commissionRate), 0) FROM Agency a")
                .getSingleResult();
        if (result != null) {
            return BigDecimal.valueOf(((Number) result).doubleValue()).setScale(2, RoundingMode.HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    public Map<String, Long> getCampaignStatusBreakdown() {
        return getGroupCount("SELECT c.status, COUNT(c) FROM Campaign c GROUP BY c.status");
    }

    public BigDecimal getTotalCampaignBudget() {
        Object result = entityManager.createQuery("SELECT COALESCE(SUM(c.budget), 0) FROM Campaign c")
                .getSingleResult();
        if (result != null) {
            return (result instanceof BigDecimal) ? (BigDecimal) result : BigDecimal.valueOf(((Number) result).doubleValue());
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal getAverageCampaignBudget() {
        Object result = entityManager.createQuery("SELECT COALESCE(AVG(c.budget), 0) FROM Campaign c")
                .getSingleResult();
        if (result != null) {
            return BigDecimal.valueOf(((Number) result).doubleValue()).setScale(2, RoundingMode.HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    public Map<String, Long> getShootStatusBreakdown() {
        return getGroupCount("SELECT s.status, COUNT(s) FROM Shoot s GROUP BY s.status");
    }

    public Map<String, Long> getShootTypeBreakdown() {
        return getGroupCount("SELECT s.shootType, COUNT(s) FROM Shoot s GROUP BY s.shootType");
    }

    public BigDecimal getTotalShootBudget() {
        Object result = entityManager.createQuery("SELECT COALESCE(SUM(s.budget), 0) FROM Shoot s")
                .getSingleResult();
        if (result != null) {
            return (result instanceof BigDecimal) ? (BigDecimal) result : BigDecimal.valueOf(((Number) result).doubleValue());
        }
        return BigDecimal.ZERO;
    }

    public long getUpcomingShootsCount() {
        Object result = entityManager.createQuery(
                "SELECT COUNT(s) FROM Shoot s WHERE s.shootDate >= :today AND s.status != 'CANCELLED'")
                .setParameter("today", LocalDate.now())
                .getSingleResult();
        return result != null ? ((Number) result).longValue() : 0L;
    }

    private Map<String, Long> getGroupCount(String jpql) {
        List<?> rows = entityManager.createQuery(jpql).getResultList();
        Map<String, Long> map = new HashMap<>();
        for (Object rowObj : rows) {
            if (rowObj instanceof Object[] row) {
                String key = row[0] != null ? row[0].toString() : "UNKNOWN";
                Long count = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                map.put(key, count);
            }
        }
        return map;
    }
}

