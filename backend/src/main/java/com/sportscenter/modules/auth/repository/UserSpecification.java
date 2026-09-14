package com.sportscenter.modules.auth.repository;

import com.sportscenter.modules.auth.entity.Role;
import com.sportscenter.modules.auth.entity.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {

    public static Specification<User> filter(String keyword, Role role, Boolean isActive) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(keyword)) {
                String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate fullNamePredicate = cb.like(cb.lower(root.get("fullName")), searchPattern);
                Predicate emailPredicate = cb.like(cb.lower(root.get("email")), searchPattern);
                Predicate phonePredicate = cb.like(root.get("phone"), "%" + keyword.trim() + "%");
                predicates.add(cb.or(fullNamePredicate, emailPredicate, phonePredicate));
            }

            if (role != null) {
                predicates.add(cb.equal(root.get("role"), role));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
