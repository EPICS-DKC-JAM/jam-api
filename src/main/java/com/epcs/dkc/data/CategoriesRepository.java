package com.epcs.dkc.data;

import org.springframework.data.repository.CrudRepository;

/**
 * Created by shane on 2/17/17.
 */
public interface CategoriesRepository extends CrudRepository<Categories, Long> {

    Categories findById(int id);
    Categories findByName(String name);

}
