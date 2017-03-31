package com.epcs.dkc.data;

import org.springframework.data.repository.CrudRepository;

/**
 * Created by shane on 2/17/17.
 */
public interface ModifiersRepository extends CrudRepository<Modifiers, Long> {

    Modifiers findById(int id);
    Modifiers findByName(String name);

}
