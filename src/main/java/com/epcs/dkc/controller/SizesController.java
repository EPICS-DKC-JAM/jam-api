package com.epcs.dkc.controller;

import com.epcs.dkc.data.Categories;
import com.epcs.dkc.data.Communicator;
import com.epcs.dkc.data.Sizes;
import org.hibernate.engine.jdbc.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by shai on 3/24/17.
 */
@Controller
@RequestMapping("/sizes")
public class SizesController {

    @Autowired
    private Communicator dataCommunicator;

    @RequestMapping(path="/add")
    public @ResponseBody String addNewSize(@RequestParam String name, @RequestParam String sizes) {
        return dataCommunicator.addSize(name, sizes);
    }

    @RequestMapping(path="/getById")
    public @ResponseBody List<Sizes> getById(String ids) {
        List<Sizes> sizes = new ArrayList<>();

        for (String id : ids.split(",")) {
            sizes.add(dataCommunicator.getSizeById(Integer.parseInt(id)));
        }

        return sizes;
    }

    @RequestMapping(path="/all")
    public @ResponseBody Iterable<Sizes> getAllSizes() {
        return dataCommunicator.getAllSizes();
    }
}
