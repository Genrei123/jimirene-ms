package com.jwt.spring_security.repo;

import com.jwt.spring_security.model.Item;
import com.jwt.spring_security.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepo extends JpaRepository<Item, Long> {

    Item findByItemID(Long id);

}
